import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PAGE_SIZE } from "@/config/app";
import { getSession } from "@/lib/utils";

/**
 * get adjustments
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
  try {
    // const user = await getSession(req);
    // if (!user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // get params
    const { searchParams } = req.nextUrl;
    const params = Object.fromEntries([...searchParams.entries()]);

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
    return NextResponse.json(
      {
        data: response,
        pagination: {
          page: currentPage,
          pageSize: PAGE_SIZE,
          pageCount: Math.ceil(pages / PAGE_SIZE),
          pages,
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
 * create adjustment
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lineItems, reason, notes = "fdf", locationId } = body;
    console.log(body);
    const user = await getSession(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const location = !isNaN(locationId) ? Number(locationId) : user.locationId;

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
    return NextResponse.json(
      { data: adjustment, message: "created" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
