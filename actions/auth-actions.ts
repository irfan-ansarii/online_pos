"use server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sanitize } from "@/lib/sanitize-user";
import { decodeJwt } from "@/lib/decode-jwt";

/**
 * login
 * @param values
 * @returns
 */
export async function login(values: { email: string; password: string }) {
  try {
    const { email, password } = values;

    // check if email and password is there
    if (!email || !password) {
      throw new Error("Email and password is required");
    }

    // find user
    const user = await prisma.user.findUnique({ where: { email } });

    // validate password
    const isValid = await bcryptjs.compare(password, user?.password as string);

    if (!user || !isValid) {
      throw new Error("Invalid email or password");
    }

    if (user.status === "blocked") {
      throw new Error("Your account has been blocked");
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

    const response = {
      message: "Logged in successfully",
      data: sanitize(user),
      token,
    };
    const twoDays = 2 * 24 * 60 * 60 * 1000;

    cookies().set("_auth_token", token, {
      expires: Date.now() - twoDays,
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
    throw new Error("Internal server error");
  }
}

/**
 * logout
 * @returns
 */
export async function logout() {
  try {
    cookies().delete("_auth_token");
    return {
      message: "Logout successfull",
    };
  } catch (error: any) {
    throw new Error("Internal server error");
  }
}

/**
 * signup
 * @param values
 */
export async function signup(values: { email: string; password: string }) {
  try {
    const { email, password } = values;

    if (!email || !password) {
      throw new Error("Email and password is required");
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.role === "customer" || user.role === "supplier") {
      throw new Error("Signup not allowed, contact admin");
    }

    // if user exists and active
    if (user.email && user.status !== "invited") {
      throw new Error("Email already registered");
    }

    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // create user
    const response = await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        status: "active",
      },
    });

    // return response
    return {
      message: "Account created successfully",
      data: sanitize(response),
    };
  } catch (error) {
    throw new Error("Internal server error");
  }
}

export async function session() {
  try {
    const session = decodeJwt() as JwtPayload | undefined;

    if (!session) {
      cookies().set("_auth_token", "", {
        expires: Date.now(),
      });
      return {
        message: "Unauthorized",
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.id,
      },
      include: {
        location: true,
      },
    });

    return { data: sanitize(user) };
  } catch (err) {
    throw new Error("Internal server error");
  }
}

/**
 * send otp
 * @param values
 * @returns
 */

export async function sendOTP(values: { email: string }) {
  try {
    const { email } = values;
    // chek if email is empty
    if (!email) {
      throw new Error("Email is required");
    }

    // find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.role === "customer" || user.role === "supplier") {
      throw new Error("Email is not registered");
    }

    if (user.status !== "active") {
      throw new Error("Account blocked, contact admin");
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
    return {
      message: "OTP has been sent",
      data: { email },
    };
  } catch (error: any) {
    throw new Error("Internal server error");
  }
}

/**
 * verify otp
 * @param values
 * @returns
 */
export async function verifyOTP(values: { email: string; otp: string }) {
  try {
    const { email, otp } = values;

    // find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // check input data
    if (!otp || !email || !user) {
      throw new Error("Invalid request  data");
    }

    // if incorrect otp
    if (user.recoveryOtp !== otp) {
      throw new Error("Incorrect OTP");
    }

    return {
      message: "OTP verified successfully",
    };
  } catch (error: any) {
    throw new Error("Internal server error");
  }
}

/**
 * reset password
 * @param values
 * @returns
 */
export async function resetPassword(values: {
  newPassword: string;
  confirmNewPassword: string;
  email: string;
}) {
  try {
    const { newPassword, confirmNewPassword, email } = values;

    // find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!email || !newPassword || !confirmNewPassword || !user) {
      throw new Error("Invalid request  data");
    }

    // check if new password and confirm new password is same
    if (newPassword !== confirmNewPassword) {
      throw new Error("Passwords do not match");
    }

    // hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(confirmNewPassword, salt);

    // update user
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        recoveryOtp: "",
        recoverySentAt: "",
      },
    });

    // return response
    return {
      message: "Password reset successfull",
    };
  } catch (error: any) {
    throw new Error("Internal server error");
  }
}
