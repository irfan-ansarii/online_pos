"use server";
import prisma from "@/lib/prisma";
import { Expense, Prisma } from "@prisma/client";

import { auth } from "@/lib/auth";
import { PAGE_SIZE } from "@/config/app";

/**
 * get expenses
 * @param req
 * @returns
 */

interface ParamsProps {
  [key: string]: string;
}
export async function getExpenses(params: ParamsProps) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const { page, search } = params;

    const currentPage = parseInt(page, 10) || 1;

    const offset = (currentPage - 1) * PAGE_SIZE;

    const filters: Prisma.ExpenseWhereInput = {
      AND: [
        { locationId: session.location.id },

        {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { category: { contains: search, mode: "insensitive" } },
            { notes: { contains: search, mode: "insensitive" } },
          ],
        },
      ],
    };

    // find expenses
    const expenses = await prisma.expense.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: [
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        },
      ],
      where: {
        ...filters,
      },
    });

    // get pagination
    const total = await prisma.expense.count({
      where: {
        ...filters,
      },
    });

    return {
      data: expenses,
      pagination: {
        page: currentPage,
        pageSize: PAGE_SIZE,
        pageCount: Math.ceil(total / PAGE_SIZE),
        total: total,
      },
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * create expense
 * @param req
 * @returns
 */

interface CreateProps {
  name: string;
  category: string;
  amount?: any;
  notes: any;
  createdAt: string;
}
export async function createExpense(values: CreateProps) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const { name, category, notes, createdAt, amount } = values;

    // create expense
    const expense = await prisma.expense.create({
      data: {
        locationId: session.location.id,
        name,
        category,
        amount: parseFloat(parseFloat(amount).toFixed(2)),
        notes,
        createdAt: new Date(createdAt).toISOString(),
      },
    });

    // return response
    return { data: expense, message: "created" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * update expense
 * @param values
 * @returns
 */
interface UpdateProps {
  id: number | null;
  name: string;
  category: string;
  amount?: any;
  notes: any;
  createdAt: string;
}
export async function updateExpense(values: UpdateProps) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const { id, name, category, notes, createdAt, amount } = values;

    // create expense
    const expense = await prisma.expense.update({
      where: {
        id: id!,
      },
      data: {
        locationId: session.location.id,
        name,
        category,
        amount: parseFloat(amount?.toFixed(2)),
        notes,
        createdAt: new Date(createdAt).toISOString(),
      },
    });

    // return response
    return { data: expense, message: "updated" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

export async function deleteExpense(id: number) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    // create expense
    const expense = await prisma.expense.delete({
      where: {
        id: id!,
      },
    });

    // return response
    return { data: expense, message: "success" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}
