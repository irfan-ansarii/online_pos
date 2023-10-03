import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    const params = Object.fromEntries([...searchParams.entries()]);

    const { page, perPage, search } = params;

    const currentPage = parseInt(page, 10) || 1;
    const itemsPerPage = parseInt(perPage, 10) || 10;

    const offset = (currentPage - 1) * itemsPerPage;

    const users = await prisma.user.findMany({
      skip: offset,
      take: itemsPerPage,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ data: users }, { status: 200 });
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
