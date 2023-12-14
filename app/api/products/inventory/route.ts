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
        { location: { id: Number(user.locationId) } },
        {
          OR: [
            { variant: { title: { contains: search, mode: "insensitive" } } },
            { variant: { sku: { contains: search, mode: "insensitive" } } },
            { variant: { barcode: { contains: search, mode: "insensitive" } } },
            {
              variant: {
                product: { title: { contains: search, mode: "insensitive" } },
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
        location: true,
      },
    });

    // get pagination
    const total = prisma.transfer.count({
      orderBy: {
        createdAt: "desc",
      },
    });

    const [inventory, pageTotal] = await prisma.$transaction([response, total]);

    const transformed = inventory.map((item) => ({
      id: item.id,
      stock: item.stock,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      location: item.location,
      variant: {
        id: item.variant.id,
        title: item.variant.title,
        sku: item.variant.sku,
        barcode: item.variant.barcode,
        purchasePrice: item.variant.purchasePrice,
        salePrice: item.variant.salePrice,
        option: item.variant.option,
        taxRate: item.variant.taxRate,
        createdAt: item.variant.createdAt,
        updatedAt: item.variant.updatedAt,
      },
      product: {
        id: item.variant.product.id,
        title: item.variant.product.title,
        description: item.variant.product.description,
        type: item.variant.product.type,
        status: item.variant.product.status,
        options: item.variant.product.options,
        image: item.variant.product.image,
        createdAt: item.variant.product.createdAt,
        updatedAt: item.variant.product.updatedAt,
      },
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
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
