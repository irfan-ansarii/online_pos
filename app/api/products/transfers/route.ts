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
    const user = await getSession(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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
            { fromId: { equals: user?.locationId } },
            { toId: { equals: user?.locationId } },
          ],
        },
      ],
    };

    // find locations
    const locations = await prisma.location.findMany();

    // find all transfers
    const transfers = await prisma.transfer.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      where: { ...filters },
      include: {
        lineItems: { include: { image: true } },
      },
    });

    // add source and destination to response
    const transfersWithLocation = transfers.map((item) => {
      const fromIndex = locations.findIndex((loc) => loc.id === item.fromId);
      const toIndex = locations.findIndex((loc) => loc.id === item.toId);

      return {
        ...item,
        source: locations[fromIndex],
        destination: locations[toIndex],
      };
    });

    // get pagination
    const total = await prisma.transfer.count({
      orderBy: {
        createdAt: "desc",
      },
    });

    // return response
    return NextResponse.json(
      {
        data: transfersWithLocation,
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

    if (Number(user.locationId) === Number(toId)) {
      return NextResponse.json(
        { message: "Source and destination cannot be same" },
        { status: 401 }
      );
    }

    if (!toId || !lineItems || lineItems.length <= 0) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    const sourceId = Number(user.locationId);

    // oranize line items data
    const lineItemsToCreate = lineItems.map((item: any) => ({
      title: item.title,
      variantTitle: item.variantTitle,
      sku: item.sku,
      price: item.price,
      quantity: item.quantity,
      total: item.total,
      status: "pending",
      variantId: Number(item.variantId),
      imageId: Number(item.imageId),
    }));

    // create transfer and transfer line items
    const transfer = await prisma.transfer.create({
      data: {
        toId: Number(toId),
        fromId: sourceId,
        status: "pending",
        totalItems,
        totalAmount,
        lineItems: {
          create: lineItemsToCreate,
        },
      },
    });

    // reduce stock from the source
    for (const item of lineItems) {
      const variantId = Number(item.variantId);
      const quantity = Number(item.quantity);

      const updateResponse = await prisma.inventory.updateMany({
        data: {
          stock: { decrement: item.quantity },
        },
        where: {
          AND: [{ locationId: sourceId }, { variantId: variantId }],
        },
      });

      if (!updateResponse) {
        await prisma.inventory.create({
          data: {
            locationId: sourceId,
            variantId: variantId,
            stock: 0 - quantity,
          },
        });
      }
    }
    // return response
    return NextResponse.json({ data: transfer }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
