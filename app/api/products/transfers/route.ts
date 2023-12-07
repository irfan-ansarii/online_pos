import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PAGE_SIZE } from "@/config/app";

/**
 * get transfers
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
  try {
    // get params
    const { searchParams } = req.nextUrl;
    const params = Object.fromEntries([...searchParams.entries()]);

    // destructure params
    const { page, search, status } = params;

    // pagination
    const currentPage = parseInt(page, 10) || 1;

    const offset = (currentPage - 1) * PAGE_SIZE;

    // const filters: Prisma.TransferWhereInput = {
    //   AND: [
    //     { status: { equals: status } },
    //     {
    //       OR: [
    //         { fromId: { contains: search.toString(), mode: "insensitive" } } ,
    //         { toId: { contains: search, mode: "insensitive" } },
    //       ],
    //     },
    //   ],
    // };

    // find locations
    const locations = await prisma.location.findMany();

    // find all transfers
    const transfers = await prisma.transfer.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },

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
    const { fromId, toId, status, lineItems, totalItems, totalAmount } = body;

    if (!fromId || !toId || !lineItems || lineItems.length <= 0) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // oranize line items data
    const lineItemsToCreate = lineItems.map((item: any) => ({
      title: item.title,
      variantTitle: item.variantTitle,
      sku: item.sku,
      price: item.price,
      quantity: item.quantity,
      total: item.total,
      variantId: item.variantId,
      imageId: item.imageId,
    }));

    // create transfer and transfer line items
    const product = await prisma.transfer.create({
      data: {
        toId: parseInt(toId),
        fromId: parseInt(fromId),
        status,
        totalItems,
        totalAmount,
        lineItems: {
          create: lineItemsToCreate,
        },
      },
    });

    // subtruct line items quantity from the source location

    // return response
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT() {}

export async function DELETE() {}
