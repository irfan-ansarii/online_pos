"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

/**
 * get option
 * @param params
 * @returns
 */
export async function getOption(key: string) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    // find option
    const response = await prisma.options.findFirst({
      where: { key: key, locationId: session.location.id },
    });

    // return response
    return {
      data: response,
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * upsert option
 * @param data
 * @returns
 */
interface UpsertParams {
  key: string;
  value: string;
}
export async function upsertOption(values: UpsertParams) {
  try {
    const session = await auth();

    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }
    const { key, value } = values;

    const optionExist = await prisma.options.findFirst({
      where: {
        AND: [{ key: key }, { locationId: session.location.id }],
      },
    });

    let response;

    if (optionExist) {
      response = await prisma.options.update({
        where: { id: optionExist.id },
        data: { value: value },
      });
    } else {
      response = await prisma.options.create({
        data: {
          value: value,
          key: key,
          locationId: session.location.id,
        },
      });
    }

    return {
      data: response,
      message: "success",
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * delete option
 * @param data
 * @returns
 */

export async function deleteOption(key: string) {
  try {
    const session = await auth();

    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const optionExist = await prisma.options.findFirst({
      where: {
        AND: [{ key: key }, { locationId: session.location.id }],
      },
    });

    if (!optionExist) {
      throw new Error("Invalid identifier");
    }

    const response = await prisma.options.delete({
      where: { id: optionExist.id },
    });

    return {
      data: response,
      message: "success",
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}
