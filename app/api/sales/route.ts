import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { decodeJwt, JwtPayload } from "@/lib/decode-jwt";
import { PAGE_SIZE } from "@/config/app";
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
    const { page, search } = params;

    // pagination
    const currentPage = parseInt(page, 10) || 1;

    const offset = (currentPage - 1) * PAGE_SIZE;

    // find active products
    const products = await prisma.product.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        status: { equals: "active" },
      },
      include: {
        variants: true,
      },
    });

    // get pagination
    const total = await prisma.product.count({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        status: { equals: "active" },
      },
    });

    // return response
    return NextResponse.json(
      {
        data: products,
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
    const {
      title,
      locationId,
      customerId,
      employeeId,
      billingAddress,
      shippingAddress,
      lineItemsTotal,
      subtotal,
      totalTax,
      totalDiscount,
      total,
      totalDue,
      taxLines,
      createdAt,
      status,
      taxType,
      lineItems,
      transactions,
    } = body;
    const session = decodeJwt(req) as JwtPayload | undefined;
    console.log("session:", session);
    // sale, line items and transactions
    const product = await prisma.sale.create({
      data: {
        title,
        locationId,
        customerId,
        employeeId,
        lineItemsTotal,
        subtotal,
        totalTax,
        totalDiscount,
        total,
        totalDue,
        taxLines,
        status,
        taxType,
        // lineItems: {
        //   create: [...lineItems],
        // },
        transactions: {
          create: [...transactions],
        },
      },
    });

    // return response
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
