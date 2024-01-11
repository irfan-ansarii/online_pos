"use server";

import prisma from "@/lib/prisma";
import {
  LineItem,
  Prisma,
  SaleFinancialStatus,
  TransactionKind,
} from "@prisma/client";
import { auth } from "@/lib/auth";
import { PAGE_SIZE } from "@/config/app";
import { updateInventory } from "./inventory-actions";

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
        { status: { equals: status as SaleFinancialStatus } },
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
      total,
      roundedOff,
      totalDue,
      taxLines,
      lineItems,
      lineItemsTotal,
      transactions,
      status,
    } = values;

    const lineItemsToCreate = lineItems.map((lineItem: LineItem) => ({
      locationId: session.location.id,
      title: lineItem.title,
      variantTitle: lineItem.variantTitle,
      sku: lineItem.sku,
      barcode: `${lineItem.barcode}`,
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
        roundedOff: parseFloat(roundedOff.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        totalDue: parseFloat(totalDue.toFixed(2)),
        taxLines,
        lineItemsTotal,
        status,
        // create line items
        lineItems: {
          createMany: {
            data: lineItemsToCreate,
          },
        },
      },
    });

    // update inventory
    const updateData = lineItems.map((item: LineItem) => ({
      variantId: item.variantId,
      quantity:
        item.quantity > 0 ? -Math.abs(item.quantity) : Math.abs(item.quantity),
    }));

    await updateInventory({ data: updateData });

    // update transactions
    await createTransactions({ saleId: sale.id, data: transactions });

    // update sale
    const updated = await prisma.sale.update({
      where: { id: sale.id },
      data: {
        title: `GN${sale.id}` /** prefix =* saleid *= suffix */,
      },
    });

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
// TODO
export async function updateSale(values: any) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const { id, firstName, lastName, role, status, locationId } = values;

    // @ts-ignore: Unreachable code error
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
    let status: SaleFinancialStatus = "pending";
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
