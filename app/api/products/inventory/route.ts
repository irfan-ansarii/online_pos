import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ProductStatus, Prisma } from "@prisma/client";
import { sanitizeOutput } from "@/lib/utils";
import { PAGE_SIZE } from "@/config/app";

/**
 * get products
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
  try {
    // destructure params

    const { searchParams } = req.nextUrl;
    const params = Object.fromEntries([...searchParams.entries()]);

    // destructure params
    const { page, search } = params;
    const currentPage = parseInt(page, 10) || 1;

    const offset = (currentPage - 1) * PAGE_SIZE;

    const filters: Prisma.ProductWhereInput = {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    };

    // inventory
    const products = await prisma.inventory.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },

      include: { variant: { include: { product: { where: { title: "" } } } } },
    });

    // get pagination
    const total = await prisma.product.count({
      orderBy: {
        createdAt: "desc",
      },
      where: { ...filters },
    });
    const sanitizedProducts = sanitizeOutput(products, ["imageId"]);

    // return response
    return NextResponse.json(
      {
        data: sanitizedProducts,
        pagination: {
          page: currentPage,
          pageSize: PAGE_SIZE,
          pageCount: Math.ceil(total / PAGE_SIZE),
          total,
        },
      },

      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
