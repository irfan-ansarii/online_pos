import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize-user";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // check if email and password is there
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password is required" },
        { status: 400 }
      );
    }

    // find user
    const user = await prisma.user.findUnique({ where: { email } });

    // validate password
    const isValid = await bcryptjs.compare(password, user?.password as string);

    if (!user || !isValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.status === "blocked") {
      return NextResponse.json(
        { message: "Your account has been blocked" },
        { status: 403 }
      );
    }

    //create token data
    const tokenData = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    //create token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "2d",
    });

    const response = NextResponse.json({
      message: "Logged in successfully",
      success: true,
      data: sanitize(user),
      token,
    });

    response.cookies.set("_auth_token", token, {
      httpOnly: true,
    });

    // update last sign in
    await prisma.user.update({
      where: { email },
      data: {
        lastSignInAt: new Date(),
      },
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
