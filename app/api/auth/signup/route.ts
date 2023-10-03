import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sanitize } from "@/lib/sanitize-user";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password is required" },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({ where: { email } });

    // if user exists and active
    if (user?.email && user?.status !== "invited") {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // if user is not invited or it is not user or admin
    if (!user?.email || (user?.role !== "admin" && user?.role !== "user")) {
      return NextResponse.json(
        { message: "Account creation not allowed" },
        { status: 400 }
      );
    }

    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // create user
    const response = await prisma.users.update({
      where: { email },
      data: {
        ...body,
        password: hashedPassword,
        status: "active",
      },
    });

    // return response
    return NextResponse.json({
      message: "Account created successfully",
      status: 201,
      data: sanitize(response),
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
