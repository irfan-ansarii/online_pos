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

    // find active sales
    const sales = await prisma.sale.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        employee: true,
        customer: true,
        lineItems: true,
      },
    });

    // get pagination
    const total = await prisma.sale.count({
      orderBy: {
        createdAt: "desc",
      },
    });

    // return response
    return NextResponse.json(
      {
        data: sales,
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
 * create sale
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

    // sale, line items and transactions
    const sale = await prisma.sale.create({
      data: {
        title,
        locationId,
        billingAddress,
        shippingAddress,
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
        createdAt,
        lineItems: {
          create: [...lineItems],
        },
        transactions: {
          create: [...transactions],
        },
      },
    });

    // return response
    return NextResponse.json({ data: sale }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
