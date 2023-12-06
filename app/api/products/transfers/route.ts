import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Transfer, Prisma } from "@prisma/client";
import { PAGE_SIZE } from "@/config/app";
import { sanitizeOutput } from "@/lib/utils";

/**
 * get products
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

    const filters: Prisma.TransferWhereInput = {
      AND: [
        { status: { equals: status } },
        {
          // OR: [
          //   { fromId: { contains: search.toString(), mode: "insensitive" } } ,
          //   { toId: { contains: search, mode: "insensitive" } },
          // ],
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
        lineItems: true,
      },
    });

    // get pagination
    const total = await prisma.transfer.count({
      orderBy: {
        createdAt: "desc",
      },
      //  where: { ...filters },
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
 * create product
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fromId, toId, status, lineItems, totalItems, totalAmount } = body;

    if (!fromId || !toId) {
      return "error";
    }
    if (!lineItems || lineItems.length <= 0) {
      return "line items error";
    }

    const lineItemsToCreate = lineItems.map(
      (item: Prisma.TransferLineItemCreateInput) => ({
        title: item.title,
        variantTitle: item.variantTitle,
        sku: item.sku,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
        variantId: item.variantId,
      })
    );

    // create transfer and transfer line items
    const product = await prisma.transfer.create({
      data: {
        toId: parseInt(toId),
        fromId: parseInt(fromId),
        status,
        totalItems,
        totalAmount,
        lineItem: {
          create: lineItemsToCreate,
        },
      },
    });

    // return response
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
