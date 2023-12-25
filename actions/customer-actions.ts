import prisma from "@/lib/prisma";
import { Address, Prisma, User } from "@prisma/client";

import { sanitize } from "@/lib/sanitize-user";
import { auth } from "@/lib/auth";
import { PAGE_SIZE } from "@/config/app";

/**
 * get customers
 * @param req
 * @returns
 */

interface ParamsProps {
  [key: string]: string;
}
export async function getCustomers(params: ParamsProps) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const { page, search } = params;

    const currentPage = parseInt(page, 10) || 1;

    const offset = (currentPage - 1) * PAGE_SIZE;

    const filters: Prisma.UserWhereInput = {
      AND: [
        { role: { equals: "customer" } },
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
        _count: {
          select: { customerSale: true },
        },
        customerSale: {
          select: { total: true },
        },
        addresses: true,
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

    const [customers, total] = await prisma.$transaction([
      usersTransaction,
      totalTransaction,
    ]);

    const transformed = customers.map((user) => {
      const sanitized = sanitize(user);

      const orderTotal = user.customerSale.reduce((acc, cur) => {
        return acc + cur.total;
      }, 0);

      return {
        ...sanitized,
        customer: null,
        orders: {
          _count: { total: user._count.customerSale },
          _sum: {
            total: orderTotal,
          },
        },
        addresses: user.addresses,
      };
    });

    return {
      data: transformed,
      pagination: {
        page: currentPage,
        pageSize: PAGE_SIZE,
        pageCount: Math.ceil(total / PAGE_SIZE),
        total: total,
      },
    };
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
}

/**
 * create customer
 * @param req
 * @returns
 */
interface CustomerProps extends User {
  addresses?: Address[];
}
export async function createCustomer(values: CustomerProps) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const { firstName, lastName, phone, email, addresses } = values;

    // check if user already exists
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: { equals: email } }, { phone: { equals: phone } }],
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
        email,
        role: "customer",
        status: "active",
        addresses: {
          create: addresses?.map((add: Address) => ({
            company: add.company,
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
    throw new Error(error.message || "Internal server error");
  }
}

/**
 * get customer and analytics
 * @param id
 * @returns
 */
export async function getCustomer(id: number | string) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const customer = await prisma.user.findFirst({
      where: {
        AND: [{ id: Number(id) }, { role: "customer" }],
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

        addresses: true,
      },
    });

    if (!customer) {
      throw new Error("Not found");
    }

    const total = prisma.sale.aggregate({
      where: {
        customerId: customer.id,
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

    const sanitized = sanitize(customer);
    const transformed = {
      ...sanitized,
      sales: customer?.customerSale,
      ...total,
    };

    delete transformed.customerSale;

    return { data: transformed, message: "success" };
  } catch (error: any) {
    throw new Error(error.message || "Internal server error");
  }
}

/**
 * update customer
 * @param req
 * @param param1
 * @returns
 */
export async function updateCustomer(values: any) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const { id, firstName, lastName, phone, email, addresses } = values;

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
        email,
        addresses: {
          upsert: addresses?.map((add: any) => ({
            where: {
              id: add.id,
            },
            update: {
              company: add.company,
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
    throw new Error(error.message || "Internal server error");
  }
}
