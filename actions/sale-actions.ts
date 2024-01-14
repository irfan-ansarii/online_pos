"use server";

import prisma from "@/lib/prisma";
import {
  LineItem,
  Prisma,
  FinancialStatus,
  TransactionKind,
} from "@prisma/client";
import { auth } from "@/lib/auth";
import { PAGE_SIZE } from "@/config/app";
import { updateInventory } from "./inventory-actions";
import { createAdjustment } from "./adjustment-actions";

interface ParamsProps {
  [key: string]: string;
}

/**
 * get sales
 * @param params
 * @returns
 */
export async function getSales(params: ParamsProps) {
  try {
    const session = await auth();

    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const { page, search, status, employee, customer } = params;

    // pagination
    const currentPage = parseInt(page, 10) || 1;

    const offset = (currentPage - 1) * PAGE_SIZE;

    const filters: Prisma.SaleWhereInput = {
      AND: [
        { locationId: { equals: session.location.id } },
        { status: { equals: status as FinancialStatus } },
        {
          OR: [{ title: { contains: search, mode: "insensitive" } }],
        },
      ],
    };

    // find sales
    const sales = await prisma.sale.findMany({
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
        transactions: true,
        lineItems: { include: { product: { include: { image: true } } } },
        employee: true,
        customer: true,
      },
    });

    // get pagination
    const total = await prisma.sale.count({
      where: filters,
    });

    // return response
    return {
      data: sales,
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
 * create sale
 * @param values
 * @returns
 */

export async function createSale(values: any) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const {
      customerId,
      employeeId,
      createdAt,
      taxType,
      subtotal,
      totalTax,
      totalDiscount,
      invoiceTotal,
      total,
      roundedOff,
      totalDue,
      taxLines,
      lineItems,
      transactions,
      status,
    } = values;

    const lineItemsToCreate = lineItems.map((lineItem: LineItem) => ({
      locationId: session.location.id,
      title: lineItem.title,
      variantTitle: lineItem.variantTitle,
      sku: lineItem.sku,
      barcode: lineItem.barcode,
      price: Number(lineItem.price),
      taxRate: Number(lineItem.taxRate),
      kind: lineItem.kind,
      quantity: Number(lineItem.quantity),
      totalDiscount: Number(lineItem.totalDiscount),
      totalTax: Number(lineItem.totalTax),
      total: Number(lineItem.total),
      taxLines: lineItem.taxLines,
      productId: lineItem.productId,
      variantId: lineItem.variantId,
    }));

    // create product and variants
    const sale = await prisma.sale.create({
      data: {
        locationId: session.location.id,
        title: "GN" /** random text   */,
        customerId,
        employeeId,
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

    // update sale
    const updated = await prisma.sale.update({
      where: { id: sale.id },
      data: {
        title: `GN${sale.id}` /** prefix =* saleid *= suffix */,
      },
    });

    // create adjustments and update inventory
    const updateData = lineItems.reduce((acc: any, item: LineItem) => {
      const newItem = {
        locationId: session.location.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.kind === "return" ? item.quantity : -item.quantity,
        reason: "",
        notes: updated.title,
      };
      newItem.reason = newItem.quantity > 0 ? "sale return" : "sold";
      if (newItem.quantity !== 0) {
        acc.push(newItem);
      }

      return acc;
    }, []);

    // create sale items
    await createAdjustment(updateData);

    // update transactions
    await createTransactions({ saleId: sale.id, data: transactions });

    // return response
    return { data: updated, message: "created" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * update sale
 * @param values
 * @returns
 */
export async function updateSale(values: any) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const {
      id,
      customerId,
      employeeId,
      createdAt,
      saleType,
      taxType,
      subtotal,
      totalTax,
      totalDiscount,
      invoiceTotal,
      total,
      roundedOff,
      totalDue,
      taxLines,
      lineItems,
      transactions,
      status,
    } = values;

    const sale = await prisma.sale.findUnique({
      where: {
        id,
      },
    });

    if (!sale) {
      throw new Error("Not found");
    }

    const prismaTransactions = [];

    prismaTransactions.push(
      prisma.sale.update({
        data: {
          customerId,
          employeeId,
          createdAt,
          saleType,
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
        },
        where: {
          id: id,
        },
      })
    );

    for (const lineItem of lineItems) {
      prismaTransactions.push(
        prisma.lineItem.upsert({
          where: {
            id: lineItem.itemId || 0,
          },
          create: {
            saleId: id,
            locationId: session.location.id,
            title: lineItem.title,
            variantTitle: lineItem.variantTitle,
            sku: lineItem.sku,
            barcode: lineItem.barcode,
            price: Number(lineItem.price),
            taxRate: Number(lineItem.taxRate),
            kind: lineItem.kind,
            quantity: Number(lineItem.quantity),
            totalDiscount: Number(lineItem.totalDiscount),
            totalTax: Number(lineItem.totalTax),
            total: Number(lineItem.total),
            taxLines: lineItem.taxLines,
            productId: lineItem.productId,
            variantId: lineItem.variantId,
          },
          update: {
            price: Number(lineItem.price),
            kind: lineItem.kind,
            quantity: Number(lineItem.quantity),
            totalDiscount: Number(lineItem.totalDiscount),
            totalTax: Number(lineItem.totalTax),
            total: Number(lineItem.total),
            taxLines: lineItem.taxLines,
          },
        })
      );
    }

    // update inventory
    const updateData = lineItems.reduce((acc: any, item: any) => {
      const {
        itemId,
        kind,
        originalKind,
        quantity,
        originalQuantity = 0,
      } = item;

      let tempQuantity = -(quantity - Number(originalQuantity || 0));
      if (item.kind === "return") {
        tempQuantity = quantity - Number(originalQuantity || 0);
      }

      const newItem = {
        locationId: session.location.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: tempQuantity,
        reason: "",
        notes: sale.title,
      };

      const isKindChanged = itemId && kind !== originalKind;

      if (isKindChanged) {
        newItem.quantity = kind === "return" ? quantity : -quantity;
      }
      if (newItem.quantity !== 0) {
        newItem.reason = newItem.quantity > 0 ? "sale return" : "sold";
        acc.push(newItem);
      }

      return acc;
    }, []);

    await prisma.$transaction(prismaTransactions);

    // update sale items inventory

    await createAdjustment(updateData);

    // update transactions
    await createTransactions({ saleId: sale.id, data: transactions });

    return {
      data: sale,
      message: "success",
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * get sale
 * @param id
 * @returns
 */
export async function getSale(id: number) {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // find product
    const sale = await prisma.sale.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        transactions: true,
        lineItems: { include: { product: { include: { image: true } } } },
      },
    });

    // if product not found
    if (!sale) {
      throw new Error("Not found");
    }

    // return response
    return { data: sale, message: "success" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * delete sale
 * @param id
 * @returns
 */
export async function deleteSale(id: number) {
  try {
    const session = await auth();

    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const sale = await prisma.sale.findUnique({
      where: { id: id },
      include: { lineItems: true },
    });

    if (!sale) {
      throw new Error("Not found");
    }

    // increase stock
    const updateStock = [];
    for (const item of sale.lineItems) {
      if (item.variantId) {
        updateStock.push({
          variantId: item.variantId,
          quantity: item.quantity,
        });
      }
    }

    await updateInventory({
      data: updateStock,
      locationId: sale.locationId,
    });

    const response = await prisma.sale.delete({
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
 * create transactions
 * @param param
 * @returns
 */
export async function createTransactions({
  saleId,
  data,
}: {
  saleId: number;
  data: any[];
}) {
  try {
    const session = await auth();

    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const sale = await prisma.sale.findUnique({
      where: { id: saleId },
    });

    if (!sale) {
      throw new Error("Sale Not found");
    }

    // Calculate total amounts for new and existing transactions
    const newTransactionTotal = data.reduce(
      (acc, curr) => acc + Number(curr.amount),
      0
    );

    const aggregatedTxn = await prisma.transaction.groupBy({
      by: ["kind"],
      _sum: { amount: true },
      where: { saleId: saleId, kind: { in: ["sale", "refund"] } },
    });

    const totals = {
      sale:
        aggregatedTxn.find((item) => item.kind === "sale")?._sum?.amount || 0,
      refund:
        aggregatedTxn.find((item) => item.kind === "refund")?._sum?.amount || 0,
    };

    // Update status based on transaction totals
    let status: FinancialStatus = "pending";
    let transactionKind: TransactionKind = "sale";

    const saleTotal = newTransactionTotal + totals.sale;
    const refundTotal = newTransactionTotal + totals.refund;

    if (sale.total < 0) {
      transactionKind = "refund";
      if (refundTotal > Math.abs(sale.total)) {
        throw new Error("Refund amount must be less than total");
      }

      if (refundTotal === Math.abs(sale.total)) {
        status = "refunded";
      } else if (refundTotal < Math.abs(sale.total) && refundTotal > 0) {
        status = "partialy_refunded";
      }
    } else {
      if (saleTotal > Math.abs(sale.total)) {
        throw new Error("Payment amount must be less than total");
      }

      if (saleTotal === Math.abs(sale.total)) {
        status = "paid";
      } else if (saleTotal < Math.abs(sale.total) && saleTotal > 0) {
        status = "partialy_paid";
      }
    }

    // Update sale status and create new transactions
    const [saleTxn, transactionTxn] = await prisma.$transaction([
      prisma.sale.update({
        where: { id: saleId },
        data: { status: status },
      }),
      prisma.transaction.createMany({
        data: data.map((txn) => ({
          ...txn,
          amount: Number(txn.amount),
          kind: transactionKind,
          saleId,
          locationId: session.location.id,
        })),
      }),
    ]);

    return {
      data: { sale: saleTxn, transactions: transactionTxn },
      message: "created",
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}
