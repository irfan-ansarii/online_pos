import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { otp } = body;
    const email = request.cookies.get("_recovery_email")?.value || null;

    // if cookie is not set
    if (!otp || !email) {
      return NextResponse.json(
        { message: "Invalid request  data" },
        { status: 400 }
      );
    }

    // find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // if correct otp
    if (user?.recoveryOtp === otp) {
      const response = NextResponse.json(
        {
          message: "OTP verified successfully",
        },
        { status: 200 }
      );
      response.cookies.set("_recovery_otp", otp, { httpOnly: true });
      return response;
    }

    // if incorrect otp
    if (user?.recoveryOtp !== otp) {
      return NextResponse.json(
        {
          message: "Incorrect OTP",
        },
        { status: 400 }
      );
    }

    // general error
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
