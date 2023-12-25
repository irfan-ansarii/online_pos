"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PAGE_SIZE } from "@/config/app";
import { Prisma } from "@prisma/client";

interface ParamsProps {
  [key: string]: string;
}

/**
 * get adjustments
 * @param params
 * @returns
 */
export async function getAdjustments(params: ParamsProps) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    // destructure params
    const { page, search } = params;

    // pagination
    const currentPage = parseInt(page, 10) || 1;

    const offset = (currentPage - 1) * PAGE_SIZE;

    const filters: Prisma.AdjustmentWhereInput = {
      AND: [
        { locationId: Number(1) },
        {
          OR: [
            { product: { title: { contains: search, mode: "insensitive" } } },
            { variant: { title: { contains: search, mode: "insensitive" } } },
            { variant: { sku: { contains: search, mode: "insensitive" } } },
            {
              variant: {
                barcode: {
                  equals: !isNaN(Number(search)) ? Number(search) : -1,
                },
              },
            },
          ],
        },
      ],
    };

    // find adjustments
    const find = prisma.adjustment.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      where: { ...filters },
      include: { product: { include: { image: true } }, variant: true },
    });

    // get pagination
    const count = prisma.adjustment.count({
      where: { ...filters },
    });

    const [response, pages] = await prisma.$transaction([find, count]);

    // return response
    return {
      data: response,
      pagination: {
        page: currentPage,
        pageSize: PAGE_SIZE,
        pageCount: Math.ceil(pages / PAGE_SIZE),
        pages,
      },
    };
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
}

/**
 * create adjustment
 * @param params
 * @returns
 */
export async function createAdjustment(values: any) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const { lineItems, reason, notes, locationId } = values;

    const location = !locationId ? session.location.id : Number(locationId);

    const transactions = [];

    // create adjustment
    const response = prisma.adjustment.createMany({
      data: lineItems.map((item: any) => ({
        locationId: location,
        productId: Number(item.productId),
        variantId: item.variantId,
        quantity: Number(item.quantity),
        reason,
        notes,
      })),
    });

    transactions.push(response);

    for (const item of lineItems) {
      const inventory = prisma.inventory.updateMany({
        where: {
          AND: [
            { locationId: location! },
            { variantId: Number(item.variantId) },
          ],
        },
        data: { stock: { increment: Number(item.quantity) } },
      });
      transactions.push(inventory);
    }
    const [adjustment] = await prisma.$transaction(transactions);

    // return response
    return { data: adjustment, message: "created" };
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
}
