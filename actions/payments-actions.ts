"use server";

import prisma from "@/lib/prisma";
import { Payment, Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";

interface ParamsProps {
  [key: string]: string;
}

/**
 * get payments
 * @param params
 * @returns
 */
export async function getPayments(params?: ParamsProps) {
  try {
    const session = await auth();

    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    // find payments
    const payments = await prisma.payment.findMany({
      orderBy: {
        position: "asc",
      },
      where: {
        OR: [
          {
            type: { contains: params?.type },
          },
          { type: { contains: "all" } },
        ],
      },
    });

    // return response
    return {
      data: payments,
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * create payment
 * @param values
 * @returns
 */

export async function createPayment(values: Payment) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const { name, label, position } = values;

    // create payment
    const payment = await prisma.payment.create({
      data: {
        name,
        label,
        position,
      },
    });

    // return response
    return { data: payment, message: "created" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * update payment
 * @param values
 * @returns
 */
// TODO
export async function updatePayment(values: Payment) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const { id, name, label, position } = values;

    if (session.role !== "admin") {
      throw new Error("Access Denied");
    }

    const payment = await prisma.payment.update({
      where: { id: Number(id) },
      data: {
        name,
        label,
        position,
      },
    });

    return { data: payment, message: "updated" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

export async function deletePayment(id: number) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    if (session.role !== "admin") {
      throw new Error("Access Denied");
    }

    const payment = prisma.payment.delete({
      where: {
        id: Number(id),
      },
    });

    if (!payment) {
      throw new Error("Not found");
    }

    return { data: payment, message: "deleted" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}
