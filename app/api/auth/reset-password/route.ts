import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { newPassword, confirmNewPassword } = body;

    // check new password and confirm new password
    if (!newPassword || !confirmNewPassword) {
      return NextResponse.json(
        { message: "New password and confirm new password is required" },
        { status: 400 }
      );
    }

    // check if new password and confirm new password is same
    if (newPassword !== confirmNewPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    // get email and otp from cookies
    const email = request.cookies.get("_recovery_email")?.value || null;
    const otp = request.cookies.get("_recovery_otp")?.value || null;

    // check email and otp
    if (!email || !otp) {
      return NextResponse.json(
        { message: "Invalid request  data" },
        { status: 400 }
      );
    }

    // find user
    const user = await prisma.users.findUnique({
      where: { email },
    });

    // check if otp is same
    if (user?.recoveryOtp === otp) {
      // hash password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(confirmNewPassword, salt);

      // update user
      await prisma.users.update({
        where: { email },
        data: {
          password: hashedPassword,
          recoveryOtp: "",
        },
      });

      // return response
      const response = NextResponse.json(
        { message: "Password created successfully" },
        { status: 200 }
      );

      response.cookies.set("_recovery_otp", "", { expires: new Date(0) });
      response.cookies.set("_recovery_email", "", { expires: new Date(0) });

      return response;
    }

    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
