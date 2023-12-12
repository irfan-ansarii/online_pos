import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PAGE_SIZE } from "@/config/app";
/**
 * get customers
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

    const filters: Prisma.UserWhereInput = {
      AND: [
        { role: { equals: "customer" } },
        {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
      ],
    };

    // find users with customer role
    const users = await prisma.user.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        ...filters,
      },
      include: { customer: true },
    });

    // get pagination
    const total = await prisma.user.count({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        ...filters,
      },
    });

    const sanitized = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      emailConfirmedAt: user.emailConfirmedAt,
      phoneConfirmedAt: user.phoneConfirmedAt,
      updatedaAt: user.updatedaAt,
      createdAt: user.createdAt,
      orders: user.customer.length,
      totalSpent: user.customer.reduce((acc, curr) => {
        return (acc += Number(curr.total));
      }, 0),
    }));
    // return response
    return NextResponse.json(
      {
        data: sanitized,
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
 * create customer
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      address2,
      city,
      state,
      zip,
      country,
    } = body;

    // check if user already exists
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: { equals: email } }, { phone: { equals: phone } }],
      },
    });
    console.log(user);
    if (user) {
      return NextResponse.json(
        { message: "Email or phone already registered" },
        { status: 400 }
      );
    }

    // create customer and address
    const customer = await prisma.user.create({
      data: {
        firstName,
        lastName,
        phone,
        email,
        role: "customer",
        status: "active",
        addresses: {
          create: {
            address,
            address2,
            city,
            state,
            zip,
            country,
          },
        },
      },
    });

    // return response
    return NextResponse.json({ data: customer }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
