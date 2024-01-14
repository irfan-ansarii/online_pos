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
        { locationId: session.location.id },
        {
          OR: [
            { product: { title: { contains: search, mode: "insensitive" } } },
            { variant: { title: { contains: search, mode: "insensitive" } } },
            { variant: { sku: { contains: search, mode: "insensitive" } } },
            {
              variant: {
                barcode: {
                  contains: search,
                  mode: "insensitive",
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
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
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

    const locationId = values[0].locationId;

    // create adjustment
    const response = await prisma.adjustment.createMany({
      data: values.map((item: any) => ({
        locationId: item.locationId || session.location.id,
        productId: Number(item.productId),
        variantId: Number(item.variantId),
        quantity: Number(item.quantity),
        reason: item.reason,
        notes: item.notes,
      })),
    });

    // update inventory
    const updateData = values.map((item: any) => ({
      variantId: Number(item.variantId),
      quantity: Number(item.quantity),
    }));

    await updateInventory({
      data: updateData,
      locationId: locationId || session.location.id,
    });

    // return response
    return { data: response, message: "created" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }

    throw new Error(error.message);
  }
}
