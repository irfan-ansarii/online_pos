"use server";
import prisma from "@/lib/prisma";
import { Address, Prisma, User, UserRole } from "@prisma/client";

import { sanitize } from "@/lib/sanitize-user";
import { auth } from "@/lib/auth";
import { PAGE_SIZE } from "@/config/app";

/**
 * get contacts
 * @param req
 * @returns
 */

interface ParamsProps {
  [key: string]: string;
}
export async function getContacts(params: ParamsProps) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const { page, search, role } = params;
    const parsedRole = role as UserRole;
    const currentPage = parseInt(page, 10) || 1;

    const offset = (currentPage - 1) * PAGE_SIZE;

    const filters: Prisma.UserWhereInput = {
      AND: [
        { role: { equals: parsedRole } },
        { role: { equals: parsedRole } },
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

    // find users with customer role
    const usersTransaction = prisma.user.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        ...filters,
      },
      include: {
        addresses: true,
        customerSale: true,
        purchase: true,
      },
    });

    // get pagination
    const totalTransaction = prisma.user.count({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        ...filters,
      },
    });

    const [contacts, total] = await prisma.$transaction([
      usersTransaction,
      totalTransaction,
    ]);

    const sanitized =
      contacts?.map((user) => {
        let orderTotal = 0;

        if (user.role === "customer") {
          orderTotal = user.customerSale.reduce((acc, cur) => {
            return acc + Number(cur.total || 0);
          }, 0);
        } else {
          orderTotal = user?.purchase?.reduce((acc, cur) => {
            return acc + Number(cur.total || 0);
          }, 0);
        }

        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          status: user.status,
          role: user.role,
          createdAt: user.createdAt,
          updatedaAt: user.updatedaAt,
          addresses: user.addresses,
          _sum: orderTotal,
        };
      }) || [];

    return {
      data: sanitized,
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
 * create contact
 * @param req
 * @returns
 */
interface CustomerProps {
  firstName: string;
  lastName: string | null;
  phone: string;
  email: string | null;
  role: UserRole;
  addresses?: Address[];
}

export async function createContact(values: CustomerProps) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const { firstName, lastName, phone, role, email, addresses } = values;

    const findFilter = [];
    if (email && email.length > 0) {
      findFilter.push({ email: { equals: email || undefined } });
    }
    if (phone && phone.length > 0) {
      findFilter.push({ phone: { equals: phone } });
    }
    // check if user already exists
    const user = await prisma.user.findFirst({
      where: {
        OR: findFilter,
      },
    });

    if (user) {
      throw new Error("Email or phone already registered");
    }

    // create customer and address
    const customer = await prisma.user.create({
      data: {
        firstName,
        lastName,
        phone,
        email: email || undefined,
        role,
        status: "active",
        addresses: {
          create: addresses?.map((add: Address) => ({
            company: add.company,
            gstin: add.gstin,
            address: add.address,
            address2: add.address2,
            city: add.city,
            state: add.state,
            zip: add.zip,
            country: add.country,
          })),
        },
      },
    });

    // return response
    return { data: customer, message: "created" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * get contact and analytics
 * @param id
 * @returns
 */
export async function getContact(id: number | string) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findFirst({
      where: {
        AND: [{ id: Number(id) }],
      },
      include: {
        customerSale: {
          orderBy: { createdAt: "desc" },
          include: {
            _count: {
              select: { lineItems: true },
            },
          },
          take: 5,
        },
        purchase: {
          orderBy: { createdAt: "desc" },
          include: {
            _count: {
              select: { lineItems: true },
            },
          },
          take: 5,
        },

        addresses: true,
      },
    });

    if (!user) {
      throw new Error("Not found");
    }

    let total = {};

    if (user.role === "supplier") {
      total = await prisma.purchase.aggregate({
        where: {
          supplierId: user.id,
        },
        _sum: {
          total: true,
        },
        _avg: {
          total: true,
        },
        _count: {
          total: true,
        },
      });
    } else {
      total = await prisma.sale.aggregate({
        where: {
          customerId: user.id,
        },
        _sum: {
          total: true,
        },
        _avg: {
          total: true,
        },
        _count: {
          total: true,
        },
      });
    }

    const transformed = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt,
      updatedaAt: user.updatedaAt,
      sales: user.role === "supplier" ? user.purchase : user.customerSale,
      addresses: [],
      ...total,
    };

    return { data: transformed, message: "success" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * update contact
 * @param req
 * @param param1
 * @returns
 */
export async function updateContact(values: any) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const { id, firstName, lastName, role, status, phone, email, addresses } =
      values;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      throw new Error("Not found");
    }

    const res = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        firstName,
        lastName,
        phone,
        role,
        status,
        email,
        addresses: {
          upsert: addresses?.map((add: any) => ({
            where: {
              id: add.id,
            },
            update: {
              company: add.company,
              gstin: add.gstin,
              address: add.address,
              address2: add.address2,
              city: add.city,
              state: add.state,
              zip: add.zip,
              country: add.country,
            },
            create: {
              company: add.company,
              address2: add.address2,
              city: add.city,
              state: add.state,
              zip: add.zip,
              country: add.country,
            },
          })),
        },
      },
    });

    return { data: res, message: "updated" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}
