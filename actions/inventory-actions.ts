"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PAGE_SIZE } from "@/config/app";
import { Prisma } from "@prisma/client";

interface ParamsProps {
  [key: string]: string;
}

/**
 * get inventory
 * @param params
 * @returns
 */
export async function getInventory(params: ParamsProps) {
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

    const filters: Prisma.InventoryWhereInput = {
      AND: [
        { locationId: { equals: Number(session.location.id) } },
        {
          OR: [
            {
              variant: {
                product: { title: { contains: search, mode: "insensitive" } },
              },
            },
            {
              variant: { sku: { contains: search, mode: "insensitive" } },
            },
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

    // find all variants
    const response = prisma.inventory.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      where: { ...filters },
      include: {
        variant: { include: { product: { include: { image: true } } } },
      },
    });

    // get pagination
    const total = prisma.inventory.count({
      orderBy: {
        createdAt: "desc",
      },
    });

    const [inventory, pageTotal] = await prisma.$transaction([response, total]);

    const transformed = inventory.map((item) => ({
      ...item,
      product: item.variant.product,
    }));

    // return response
    return {
      data: transformed,
      pagination: {
        page: currentPage,
        pageSize: PAGE_SIZE,
        pageCount: Math.ceil(pageTotal / PAGE_SIZE),
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
 * update inventory
 * @param data
 * @returns
 */
interface UpdateProps {
  data: {
    quantity: number;
    variantId: number;
  }[];
  locationId?: number;
}
export async function updateInventory({ data, locationId }: UpdateProps) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }
    const transactions = [];

    for (const item of data) {
      const transaction = prisma.inventory.updateMany({
        data: {
          stock: { increment: item.quantity },
        },
        where: {
          AND: [
            { locationId: locationId || session.location.id },
            { variantId: Number(item.variantId) },
          ],
        },
      });
      transactions.push(transaction);
    }

    const response = await prisma.$transaction(transactions);

    return {
      data: response,
      message: "success",
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}
