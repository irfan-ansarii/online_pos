import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PAGE_SIZE } from "@/config/app";
import { getSession } from "@/lib/utils";

/**
 * get barcodes print list
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
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

    const filters: Prisma.LabelWhereInput = {
      AND: [
        { locationId: Number(user?.locationId) },
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
                  equals: !isNaN(Number(search)) ? Number(search) : -1,
                },
              },
            },
          ],
        },
      ],
    };

    const transactions = [];
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
    return NextResponse.json(
      {
        data: label,
        pagination: {
          page: currentPage,
          pageSize: PAGE_SIZE,
          pageCount: Math.ceil(pages / PAGE_SIZE),
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

/**
 * create product list
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lineItems } = body;

    const user = await getSession(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // create adjustment
    const response = await prisma.label.createMany({
      data: lineItems.map((item: any) => ({
        locationId: user.locationId,
        productId: item.productId,
        variantId: item.variantId,
        quantity: Number(item.quantity),
      })),
    });

    // return response
    return NextResponse.json(
      { data: response, message: "created" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
