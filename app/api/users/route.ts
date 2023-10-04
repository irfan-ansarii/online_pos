import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize-user";

export async function GET(req: NextRequest) {
  try {
    // get params
    const { searchParams } = req.nextUrl;
    const params = Object.fromEntries([...searchParams.entries()]);

    // destructure params
    const { page, perPage, search } = params;

    // pagination
    const currentPage = parseInt(page, 10) || 1;
    const pageSize = parseInt(perPage, 10) || 12;
    const offset = (currentPage - 1) * pageSize;

    // find users
    const users = await prisma.user.findMany({
      skip: offset,
      take: pageSize,
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
          pageSize,
          pageCount: Math.ceil(total / pageSize),
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, role } = body;
    console.log(body);
    // if email or password is missing
    if (!email || !role)
      return NextResponse.json(
        { message: "Email and role is required" },
        { status: 400 }
      );

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
        invitedAt: new Date(),
      },
    });

    // send email and message with signup link

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
