import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize-user";
import { PAGE_SIZE } from "@/config/app";
/**
 * get users
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
    console.log("api route:", search, params);
    // pagination
    const currentPage = parseInt(page, 10) || 1;

    const offset = (currentPage - 1) * PAGE_SIZE;

    // find users
    const users = await prisma.user.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        role: { in: ["user", "admin"] },
        status: { not: "invited" },
      },
    });

    // get pagination
    const total = await prisma.user.count({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        role: { in: ["user", "admin"] },
        status: { not: "invited" },
      },
    });

    // return response
    return NextResponse.json(
      {
        data: users.map((user) => sanitize(user)),
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
 * create user
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, role, location } = body;
    // if email or password is missing

    if (!email || !role || !location) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // check if user already exists
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // create user
    const createdUser = await prisma.user.create({
      data: {
        email,
        role,
        locationId: parseInt(location, 10),
      },
    });

    // TODO
    // !send email and message with signup link

    // return response
    return NextResponse.json(
      { message: "Invited", data: createdUser },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
