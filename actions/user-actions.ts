"use server";

import prisma from "@/lib/prisma";
import { Prisma, User, UserRole } from "@prisma/client";
import { sanitize } from "@/lib/sanitize-user";
import { auth } from "@/lib/auth";
import { PAGE_SIZE } from "@/config/app";

interface ParamsProps {
  [key: string]: string;
}

/**
 * get users
 * @param params
 * @returns
 */
export async function getUsers(params: ParamsProps) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    // destructure params
    const { page, search } = params;

    // pagination
    const currentPage = parseInt(page, 10) || 1;

    const offset = (currentPage - 1) * PAGE_SIZE;

    const filters: Prisma.UserWhereInput = {
      AND: [
        { role: { in: ["admin", "user"] } },
        { status: { not: "invited" } },
        {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        },
      ],
    };

    // find users
    const users = await prisma.user.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        ...filters,
      },
      include: { location: true },
    });

    // get pagination
    const total = await prisma.user.count({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        ...filters,
      },
    });

    // return response
    return {
      data: users.map((user) => sanitize(user)),
      pagination: {
        page: currentPage,
        pageSize: PAGE_SIZE,
        pageCount: Math.ceil(total / PAGE_SIZE),
        total,
      },
      message: "success",
    };
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
}

/**
 * create user
 * @param values
 * @returns
 */
export async function createUser(values: any) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const { email, role, locationId } = values;
    // if email or password is missing

    if (!email || !role || !locationId) {
      throw new Error("Missing required fields");
    }

    // check if user already exists
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      throw new Error("Email already registered");
    }

    // create user
    const createdUser = await prisma.user.create({
      data: {
        email,
        role,
        locationId: Number(locationId),
      },
    });

    // TODO
    // !send email and message with signup link

    // return response
    return { data: createdUser, message: "Invited" };
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
}

/**
 * update user
 * @param values
 * @returns
 */
export async function updateUser(values: any) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const { id, firstName, lastName, role, status, locationId } = values;

    // @ts-ignore: Unreachable code error
    if (session.role !== "admin") {
      throw new Error("Access Denied");
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        firstName,
        lastName,
        role,
        status,
        locationId: Number(locationId),
      },
    });

    return { data: user, message: "updated" };
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
}

/**
 *
 * @param id
 * @returns
 */
export async function getUser(id: number) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      throw new Error("Not found");
    }
    return { data: user, message: "success" };
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
}
