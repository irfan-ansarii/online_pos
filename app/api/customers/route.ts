import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PAGE_SIZE } from "@/config/app";
import { getSession } from "@/lib/utils";
import { sanitize } from "@/lib/sanitize-user";
/**
 * get customers
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
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
    const usersTransaction = prisma.user.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        ...filters,
      },
      include: {
        customer: {
          select: {
            _count: true,
            total: true,
          },
        },
        addresses: true,
      },
    });

    // get pagination
    const paginationTransaction = prisma.user.count({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        ...filters,
      },
    });

    const response = await prisma.$transaction([
      usersTransaction,
      paginationTransaction,
    ]);

    const transformed = response[0].map((user) => {
      const sanitized = sanitize(user);
      return {
        ...sanitized,
        customer: null,
        orders: user.customer,
        addresses: user.addresses,
      };
    });

    return NextResponse.json(
      {
        data: transformed,
        pagination: {
          page: currentPage,
          pageSize: PAGE_SIZE,
          pageCount: Math.ceil(response[1] / PAGE_SIZE),
          total: response[1],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
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
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, phone, email, addresses } = body;

    // check if user already exists
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: { equals: email } }, { phone: { equals: phone } }],
      },
    });

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
        addresses: addresses.map((add: any) => ({
          company: add.company,
          address: add.address,
          address2: add.address2,
          city: add.city,
          state: add.state,
          zip: add.zip,
          country: add.country,
        })),
      },
    });

    // return response
    return NextResponse.json(
      { data: customer, message: "created" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
