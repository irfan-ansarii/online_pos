import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { PAGE_SIZE } from "@/config/app";
import { getSession } from "@/lib/utils";

/**
 * get transfers
 * @param req
 * @returns
 */
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // const user = await getSession(req);

    // if (!user) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // get params
    const { searchParams } = req.nextUrl;
    const params = Object.fromEntries([...searchParams.entries()]);

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
            { fromId: { equals: 1 /*user?.locationId*/ } },
            { toId: { equals: 1 /*user?.locationId*/ } },
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
    return NextResponse.json(
      {
        data: transfers,
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

/**
 * create transfer
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toId, lineItems, totalItems, totalAmount } = body;

    const user = await getSession(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.locationId === toId) {
      return NextResponse.json(
        { message: "Source and destination cannot be same" },
        { status: 400 }
      );
    }

    if (!toId || !lineItems || lineItems.length === 0) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    const sourceId = Number(user.locationId);
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

    const transactions = [];
    // create transfer and transfer line items
    transactions[0] = prisma.transfer.create({
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

    // adjust stock from the source
    for (const item of lineItems) {
      const variantId = Number(item.variantId);
      const quantity = Number(item.quantity);

      const decrement = prisma.inventory.updateMany({
        data: {
          stock: { decrement: quantity },
        },
        where: {
          AND: [{ locationId: sourceId }, { variantId: variantId }],
        },
      });

      transactions.push(decrement);

      const increment = prisma.inventory.updateMany({
        data: {
          stock: { increment: quantity },
        },
        where: {
          AND: [{ locationId: Number(toId) }, { variantId: variantId }],
        },
      });
      transactions.push(increment);
    }

    const [transfer] = await prisma.$transaction(transactions);

    // return response
    return NextResponse.json({ data: transfer }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
