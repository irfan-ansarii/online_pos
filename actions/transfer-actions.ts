"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PAGE_SIZE } from "@/config/app";
import { Prisma } from "@prisma/client";
import { updateInventory } from "./inventory-actions";

interface ParamsProps {
  [key: string]: string;
}

/**
 * get transfers
 * @param params
 * @returns
 */
export async function getTransfers(params: ParamsProps) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    // destructure params
    const { page, search, status } = params;

    // pagination
    const currentPage = parseInt(page, 10) || 1;

    const offset = (currentPage - 1) * PAGE_SIZE;

    const filters: any = {
      AND: [
        { status: { equals: status } },
        {
          OR: [
            { fromId: { equals: session.id } },
            { toId: { equals: session.id } },
          ],
        },
      ],
    };

    // find all transfers
    const transfers = await prisma.transfer.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      where: { ...filters },
      include: {
        lineItems: {
          include: { product: { include: { image: true } }, variant: true },
        },
      },
    });

    // get pagination
    const total = await prisma.transfer.count({
      where: { ...filters },
    });

    // return response
    return {
      data: transfers,
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
 * create transfer
 * @param values
 * @returns
 */
export async function createTransfer(values: any) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const { toId, lineItems, totalItems, totalAmount } = values;

    if (session.location.id === toId) {
      throw new Error("Source and destination cannot be same");
    }

    if (!toId || !lineItems || lineItems.length === 0) {
      throw new Error("Missing required fields");
    }

    const sourceId = Number(session.location.id);
    // oranize line items data
    const lineItemsToCreate = lineItems.map((item: any) => ({
      variantId: Number(item.variantId),
      productId: Number(item.productId),
      title: item.title,
      variantTitle: item.variantTitle,
      sku: item.sku,
      barcode: item.barcode,
      price: item.price,
      quantity: item.quantity,
      total: item.total,
    }));

    // create transfer and transfer line items
    const response = await prisma.transfer.create({
      data: {
        toId: Number(toId),
        fromId: sourceId,
        status: "pending",
        totalItems,
        totalAmount,
        lineItems: {
          createMany: { data: lineItemsToCreate },
        },
      },
    });

    // reduce stock from source
    const dec = lineItems.map((item: any) => ({
      variantId: item.variantId,
      quantity: -Math.abs(item.quantity),
    }));
    await updateInventory({ data: dec, locationId: sourceId });

    // increase stock at destination
    const inc = lineItems.map((item: any) => ({
      variantId: item.variantId,
      quantity: Number(item.quantity),
    }));
    await updateInventory({ data: inc, locationId: Number(toId) });

    // return response
    return { data: response, message: "created" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}