"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

export async function getLocations() {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    // find locations
    const locations = await prisma.location.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // return response
    return {
      data: locations,
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

export async function createLocation(values: any) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const {
      type,
      name,
      phone,
      email,
      address,
      address2,
      city,
      state,
      zip,
      country,
    } = values;

    // create location
    const location = await prisma.address.create({
      data: {
        address,
        address2,
        city,
        state,
        zip,
        country,
        location: {
          create: {
            type,
            name,
            email,
            phone,
          },
        },
      },
    });

    return { data: location, message: "created" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}
/**
 * change location
 * @param locationId
 * @returns
 */
export async function changeLocation(locationId: number) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }
    //@ts-expect-error
    if (session.role !== "admin") {
      throw new Error("Access Denied");
    }

    const user = await prisma.user.update({
      where: {
        //@ts-ignore
        id: session.id,
      },
      data: {
        locationId,
      },
      include: {
        location: true,
      },
    });

    //create token data
    const tokenData = {
      id: user.id,
      email: user.email,
      role: user.role,
      location: {
        id: user.locationId,
        name: user.location?.name,
      },
      status: user.status,
    };

    //create token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "2d",
    });

    const twoDays = 48 * 60 * 60 * 1000;

    cookies().set("_auth_token", token, {
      expires: Date.now() + twoDays,
      httpOnly: true,
    });

    return { data: user, message: "success" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}
