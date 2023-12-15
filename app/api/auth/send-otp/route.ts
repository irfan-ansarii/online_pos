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

    if (!user || user.role === "customer" || user.role === "supplier") {
      return NextResponse.json(
        { message: "Email is not registered" },
        { status: 404 }
      );
    }

    if (user.status !== "active") {
      return NextResponse.json(
        { message: "Account blocked, contact admin" },
        { status: 400 }
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

    // TODO send otp

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
