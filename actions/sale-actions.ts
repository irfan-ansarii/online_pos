"use server";

import prisma from "@/lib/prisma";
import {
  LineItem,
  Prisma,
  Sale,
  SaleFinancialStatus,
  Transaction,
} from "@prisma/client";
import { auth } from "@/lib/auth";
import { PAGE_SIZE } from "@/config/app";

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

    const { page, search, status } = params;

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
      orderBy: {
        createdAt: "desc",
      },
      where: filters,
      include: {
        transactions: true,
        lineItems: true,
        employee: true,
        customer: true,
      },
    });

    const transformed = [];

    for (const sale of sales) {
      const item = [];

      for (const lineItem of sale.lineItems) {
        const product = await prisma.product.findUnique({
          where: { id: lineItem.productId },
          include: { image: true },
        });

        item.push({
          ...lineItem,
          product,
        });
      }

      transformed.push({
        ...sale,
        lineItems: item,
      });
    }

    // get pagination
    const total = await prisma.sale.count({
      where: filters,
    });

    // return response
    return {
      data: transformed,
      pagination: {
        page: currentPage,
        pageSize: PAGE_SIZE,
        pageCount: Math.ceil(total / PAGE_SIZE),
        total,
      },
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
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
      totalDiscount: parseFloat(lineItem.totalDiscount.toFixed(2)),
      totalTax: parseFloat(lineItem.totalTax.toFixed(2)),
      total: parseFloat(lineItem.total.toFixed(2)),
      taxLines: lineItem.taxLines,
      productId: lineItem.productId,
      variantId: lineItem.variantId,
    }));

    const transactionsToCreate = transactions.map((txn: Transaction) => ({
      ...txn,
      locationId: session.location.id,
      kind: "sale",
      status: "success",
      amount: parseFloat(txn.amount.toFixed(2)),
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
        // create transactions
        transactions: {
          createMany: {
            data: transactionsToCreate,
          },
        },
      },
    });

    const prismaTxn = [];
    for (const lineItem of lineItems) {
      const decrement = prisma.inventory.updateMany({
        data: {
          stock: { decrement: lineItem.quantity },
        },
        where: {
          AND: [
            { locationId: session.location.id },
            { variantId: lineItem.variantId },
          ],
        },
      });
      prismaTxn.push(decrement);
    }

    await prisma.$transaction(prismaTxn);

    const updated = await prisma.sale.update({
      where: { id: sale.id },
      data: {
        title: `GN${sale.id}` /** prefix =*sale id*= suffix */,
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
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        variants: {
          include: { inventory: { include: { location: true } } },
        },
        image: true,
      },
    });

    // if product not found
    if (!product) {
      throw new Error("Not found");
    }

    // return response
    return { data: product, message: "success" };
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
    if (!session) {
      throw new Error("Unauthorized");
    }

    const variants = await prisma.variant.findMany({
      where: { productId: Number(id) },
    });

    const recordsToDelete = variants.map((variant) => variant.id);

    const deleteInventory = prisma.inventory.deleteMany({
      where: { variantId: { in: recordsToDelete } },
    });

    const deleteVariants = prisma.variant.deleteMany({
      where: { productId: Number(id) },
    });

    const deleteProduct = prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    const [i, v, product] = await prisma.$transaction([
      deleteInventory,
      deleteVariants,
      deleteProduct,
    ]);

    if (!product) {
      throw new Error("Not found");
    }

    return { data: product, message: "success" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}
