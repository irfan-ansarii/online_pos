import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { PAGE_SIZE } from "@/config/app";
import { getSession } from "@/lib/utils";
import { Prisma } from "@prisma/client";

/**
 * get all inventory
 * @param req
 * @returns
 */
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const user = await getSession(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // get params
    const { searchParams } = req.nextUrl;
    const params = Object.fromEntries([...searchParams.entries()]);

    // destructure params
    const { page, search } = params;

    // pagination
    const currentPage = parseInt(page, 10) || 1;

    const offset = (currentPage - 1) * PAGE_SIZE;

    const filters: Prisma.InventoryWhereInput = {
      AND: [
        { locationId: { equals: Number(user.locationId) } },
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
    return NextResponse.json(
      {
        data: transformed,
        pagination: {
          page: currentPage,
          pageSize: PAGE_SIZE,
          pageCount: Math.ceil(pageTotal / PAGE_SIZE),
          total,
        },
      },

      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
