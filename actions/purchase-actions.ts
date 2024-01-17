"use server";

import prisma from "@/lib/prisma";
import { LineItem, Prisma, FinancialStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { PAGE_SIZE } from "@/config/app";
import { updateInventory } from "./inventory-actions";
import { createAdjustment } from "./adjustment-actions";
import { createBarcode } from "./barcode-actions";

interface ParamsProps {
  [key: string]: string;
}

/**
 * get purchases
 * @param params
 * @returns
 */
export async function getPurchases(params: ParamsProps) {
  try {
    const session = await auth();

    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const { page, search, status } = params;

    // pagination
    const currentPage = parseInt(page, 10) || 1;

    const offset = (currentPage - 1) * PAGE_SIZE;

    const filters: Prisma.PurchaseWhereInput = {
      AND: [
        { locationId: { equals: session.location.id } },
        { status: { equals: status as FinancialStatus } },
        {
          OR: [{ title: { contains: search, mode: "insensitive" } }],
        },
      ],
    };

    // find sales
    const purchases = await prisma.purchase.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: [
        {
          id: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      where: filters,
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
        },
        lineItems: { include: { product: { include: { image: true } } } },
        supplier: true,
      },
    });

    // get pagination
    const total = await prisma.purchase.count({
      where: filters,
    });

    // return response
    return {
      data: purchases,
      pagination: {
        page: currentPage,
        pageSize: PAGE_SIZE,
        pageCount: Math.ceil(total / PAGE_SIZE),
        total,
      },
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * create purchase
 * @param values
 * @returns
 */

export async function createPurchase(values: any) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const {
      supplierId,
      title,
      createdAt,
      taxType,
      subtotal,
      totalTax,
      totalDiscount,
      total,
      roundedOff,
      invoiceTotal,
      totalDue,
      taxLines,
      lineItems,
      transactions,
      status,
    } = values;

    const lineItemsToCreate = lineItems.map((lineItem: LineItem) => ({
      locationId: session.location.id,
      title: lineItem.title,
      kind: lineItem.kind,
      variantTitle: lineItem.variantTitle,
      sku: lineItem.sku,
      barcode: lineItem.barcode,
      price: Number(lineItem.price),
      taxRate: Number(lineItem.taxRate),
      quantity: Number(lineItem.quantity),
      totalDiscount: Number(lineItem.totalDiscount),
      totalTax: Number(lineItem.totalTax),
      total: Number(lineItem.total),
      taxLines: lineItem.taxLines,
      productId: lineItem.productId,
      variantId: lineItem.variantId,
    }));

    // create product and variants
    const purchase = await prisma.purchase.create({
      data: {
        locationId: session.location.id,
        title,
        supplierId,
        createdAt,
        taxType,
        subtotal: parseFloat(subtotal.toFixed(2)),
        totalTax: parseFloat(totalTax.toFixed(2)),
        totalDiscount: parseFloat(totalDiscount.toFixed(2)),
        invoiceTotal: parseFloat(invoiceTotal.toFixed(2)),
        roundedOff: parseFloat(roundedOff.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        totalDue: parseFloat(totalDue.toFixed(2)),
        taxLines,
        status,
        // create line items
        lineItems: {
          createMany: {
            data: lineItemsToCreate,
          },
        },
      },
    });

    // organize stock adjustment data
    const updateData = lineItems.reduce((acc: any, item: LineItem) => {
      const newItem = {
        locationId: session.location.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.kind === "return" ? -item.quantity : item.quantity,
        reason: "",
        notes: purchase.title,
      };
      newItem.reason = newItem.quantity < 0 ? "purchase return" : "received";
      if (newItem.quantity !== 0 && newItem.productId) {
        acc.push(newItem);
      }

      return acc;
    }, []);

    // organize barcode data
    const barcodeData = lineItems.reduce((acc: any, item: LineItem) => {
      const newItem = {
        locationId: session.location.id,
        productId: item.productId,
        quantity: Number(item.quantity),
      };

      if (newItem.quantity !== 0 && newItem.productId && newItem.quantity > 0) {
        acc.push(newItem);
      }

      return acc;
    }, []);

    // create stock adjustment
    if (updateData.length > 0) {
      await createAdjustment(updateData);
    }

    // create barcode items
    if (barcodeData.length > 0) {
      await createBarcode(barcodeData);
    }

    // create transactions
    if (transactions.length > 0) {
      await createTransactions({
        purchaseId: purchase.id,
        data: transactions,
      });
    }

    return { data: purchase, message: "created" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * update purchase
 * @param values
 * @returns
 */
export async function updatePurchase(values: any) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const { id, firstName, lastName, role, status, locationId } = values;

    if (session.role !== "admin") {
      throw new Error("Access Denied");
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        firstName,
        lastName,
        role,
        status,
        locationId: Number(locationId),
      },
    });

    return { data: user, message: "updated" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * get purchase
 * @param id
 * @returns
 */
export async function getPurchase(id: number) {
  try {
    const session = await auth();

    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    // find purchase
    const purchase = await prisma.purchase.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        transactions: true,
        supplier: true,
        lineItems: { include: { product: { include: { image: true } } } },
      },
    });

    // if purchase not found
    if (!purchase) {
      throw new Error("Not found");
    }

    // return response
    return { data: purchase, message: "success" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * delete purchase
 * @param id
 * @returns
 */
export async function deletePurchase(id: number) {
  try {
    const session = await auth();

    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const purchase = await prisma.purchase.findUnique({
      where: { id: id },
      include: { lineItems: true },
    });

    if (!purchase) {
      throw new Error("Not found");
    }

    // increase stock
    const updateStock = [];
    for (const item of purchase.lineItems) {
      if (item.variantId) {
        updateStock.push({
          variantId: item.variantId,
          quantity:
            item.quantity > 0
              ? -Math.abs(item.quantity)
              : Math.abs(item.quantity),
        });
      }
    }

    await updateInventory({
      data: updateStock,
      locationId: purchase.locationId,
    });

    const response = await prisma.purchase.delete({
      where: { id: id },
    });

    return { data: response, message: "success" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * Creates transactions for a given purchase, updating its status and adding new transactions.
 * @param {Object} params - Parameters for creating transactions.
 * @param {number} params.purchaseId - ID of the purchase.
 * @param {Array} params.data - Array of transaction data to be created.
 * @returns {Object} - Object containing updated data and a message.
 * @throws {Error} - Throws an error if unauthorized, purchase not found, or an internal server error occurs.
 */
export async function createTransactions({
  purchaseId,
  data,
}: {
  purchaseId: number;
  data: any[];
}) {
  try {
    // Authenticate the session
    const session = await auth();

    // If session is invalid, throw an unauthorized error
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    // Retrieve purchase information
    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
    });

    // If purchase not found, throw an error
    if (!purchase) {
      throw new Error("Purchase not found");
    }

    // Calculate total amounts for existing transactions (purchase and refund)
    const sum = await prisma.purchaseTransaction.groupBy({
      by: ["kind"],
      _sum: { amount: true },
      where: { purchaseId: purchaseId, kind: { in: ["purchase", "refund"] } },
    });

    // Extract purchase and refund totals
    const totals = {
      purchase: sum.find((item) => item.kind === "purchase")?._sum?.amount || 0,
      refund: sum.find((item) => item.kind === "refund")?._sum?.amount || 0,
    };

    // Calculate total received amount from new transactions
    const received = data.reduce((acc, curr) => {
      acc += Number(curr.amount);
      return acc;
    }, 0);

    // Calculate due amount based on existing and new transactions
    const dueAmount = purchase.total + Number(totals.refund) - totals.purchase;
    const finalDueAmount = dueAmount + (dueAmount < 0 ? received : -received);

    // Determine the financial status based on due amount and purchase total
    let status: FinancialStatus = "pending";

    if (finalDueAmount === 0) {
      status = purchase.total < 0 ? "refunded" : "paid";
    } else if (finalDueAmount !== 0 && finalDueAmount !== purchase.total) {
      status = purchase.total < 0 ? "partialy_refunded" : "partialy_paid";
    }

    let transactionKind = dueAmount < 0 ? "refund" : "purchase";

    // Update sale status and create new transactions
    const [updated] = await prisma.$transaction([
      prisma.purchase.update({
        where: { id: purchaseId },
        data: { status: status, totalDue: finalDueAmount },
      }),
      prisma.purchaseTransaction.createMany({
        data: data.map((txn) => ({
          ...txn,
          amount: Number(txn.amount),
          kind: transactionKind,
          purchaseId,
          locationId: session.location.id,
        })),
      }),
    ]);

    // Return the updated data and a success message
    return {
      data: updated,
      message: "created",
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Internal server error");
    }

    throw new Error(error.message);
  }
}
