import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email } = body;

    // chek if email is empty
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    // if no user found
    if (!user) {
      return NextResponse.json(
        { message: "Email is not registered" },
        { status: 404 }
      );
    }

    // if user is not application user or user is not active
    if (user.role !== "admin" && user.role !== "user") {
      return NextResponse.json(
        { message: "Action not allowed" },
        { status: 403 }
      );
    }

    // 1. generate otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        recoveryOtp: otp,
        recoverySentAt: new Date(),
      },
    });

    // 3. send otp

    // 4. return response
    const response = NextResponse.json(
      {
        message: "OTP has been sent",
        data: { email },
        success: true,
      },
      { status: 201 }
    );

    response.cookies.set("_recovery_email", email);
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
