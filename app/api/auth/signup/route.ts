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

    const user = await prisma.user.findUnique({ where: { email } });
    console.log(user);
    if (!user || user.role === "customer" || user.role === "supplier") {
      return NextResponse.json(
        { message: "Signup not allowed" },
        { status: 400 }
      );
    }

    // if user exists and active
    if (user.email && user.status !== "invited") {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // create user
    const response = await prisma.user.update({
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
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
