"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { PAGE_SIZE } from "@/config/app";

interface ParamsProps {
  [key: string]: string;
}

/**
 * get barcodes
 * @param params
 * @returns
 */
export async function getBarcodes(params: ParamsProps) {
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

    const filters: Prisma.LabelWhereInput = {
      AND: [
        { locationId: Number(session?.location.id) },
        { status: status },
        {
          OR: [
            {
              product: { title: { contains: search, mode: "insensitive" } },
            },
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

    // find barcode list
    const response = prisma.label.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        ...filters,
      },
      include: {
        variant: true,
        product: { include: { image: true } },
      },
    });

    // get pagination
    const total = prisma.label.count({
      where: { ...filters },
    });

    const [label, pages] = await prisma.$transaction([response, total]);

    // return response
    return {
      data: label,
      pagination: {
        page: currentPage,
        pageSize: PAGE_SIZE,
        pageCount: Math.ceil(pages / PAGE_SIZE),
        total: pages,
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
 * create barcode
 * @param values
 * @returns
 */
export async function createBarcode(values: []) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }
    // create adjustment
    const response = await prisma.label.createMany({
      data: values.map((item: any) => ({
        locationId: session.location.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: Number(item.quantity),
      })),
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

/**
 * update barcode
 * @param values
 * @returns
 */
export async function updateBarcode(values: any) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const { id, quantity, status } = values;

    // create adjustment
    const response = await prisma.label.update({
      where: { id: Number(id) },
      data: {
        status: status,
        quantity: Number(quantity),
      },
    });

    // return response
    return { data: response, message: "updated" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * print barcodes
 * @returns
 */
export async function printBarcodes() {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    // find adjustment
    const response = await prisma.label.findMany({
      where: { status: "pending" },
    });

    // return response

    return { data: response, message: "success" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}
