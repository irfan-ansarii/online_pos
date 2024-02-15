"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export const getSaleAnalytics = async (period: string) => {
  const [start, end] = period.split(":");

  const endDate = new Date(end);
  endDate.setUTCHours(23, 59, 59, 999);

  try {
    const session = await auth();
    if (!session) throw new Error("unauthorized");

    const whereFilter = {
      createdAt: {
        gte: new Date(start),
        lte: new Date(endDate),
      },
    };

    const query1 = prisma.sale.aggregate({
      where: {
        ...whereFilter,
        locationId: session.location.id,
      },
      _count: {
        _all: true,
      },
      _sum: {
        total: true,
      },
      _avg: {
        total: true,
      },
    });

    const query2 = prisma.purchase.aggregate({
      where: {
        ...whereFilter,
        locationId: session.location.id,
      },
      _count: {
        _all: true,
      },
      _sum: {
        total: true,
      },
      _avg: {
        total: true,
      },
    });

    const query3 = prisma.lineItem.aggregate({
      where: {
        ...whereFilter,
        locationId: session.location.id,
        kind: "sale",
      },
      _sum: {
        quantity: true,
      },
      _avg: {
        price: true,
      },
    });

    const query4 = prisma.user.aggregate({
      where: {
        ...whereFilter,
        role: "customer",
      },
      _count: {
        _all: true,
      },
    });

    const [sale, purchase, product, customer] = await prisma.$transaction([
      query1,
      query2,
      query3,
      query4,
    ]);

    return {
      data: { sale, purchase, product, customer },
      message: "success",
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
};

export const getTotalRevenueAnalytics = async (period: string) => {
  const [start, end] = period.split(":");

  const endDate = new Date(end);
  endDate.setUTCHours(23, 59, 59, 999);

  try {
    const session = await auth();
    if (!session) throw new Error("unauthorized");

    const whereFilter = {
      createdAt: {
        gte: new Date(start),
        lte: new Date(endDate),
      },
    };

    const query = await prisma.sale.aggregate({
      where: {
        ...whereFilter,
        locationId: session.location.id,
      },
      _count: {
        total: true,
      },
      _sum: {
        total: true,
      },
      _avg: {
        total: true,
      },
    });

    return {
      data: query,
      message: "success",
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
};

export const getProductSoldAnalytics = async (period: string) => {
  const [start, end] = period.split(":");

  const endDate = new Date(end);
  endDate.setUTCHours(23, 59, 59, 999);

  try {
    const session = await auth();
    if (!session) throw new Error("unauthorized");

    const whereFilter = {
      createdAt: {
        gte: new Date(start),
        lte: new Date(endDate),
      },
    };

    const query = await prisma.lineItem.aggregate({
      where: {
        ...whereFilter,
        locationId: session.location.id,
        kind: "sale",
      },
      _sum: {
        quantity: true,
      },
    });

    return {
      data: query,
      message: "success",
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
};
export const getPaymentAnalytics = async (period: string) => {
  const [start, end] = period.split(":");

  const endDate = new Date(end);
  endDate.setUTCHours(23, 59, 59, 999);

  try {
    const session = await auth();
    if (!session) throw new Error("unauthorized");

    const whereFilter = {
      createdAt: {
        gte: new Date(start),
        lte: new Date(endDate),
      },
    };

    const query = await prisma.transaction.groupBy({
      by: ["name"],
      where: {
        ...whereFilter,
        locationId: session.location.id,
        kind: "sale",
      },
      _count: {
        _all: true,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      data: query,
      message: "success",
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
};

export const getHourlyRevenueAnalytics = async (period: string) => {
  const [start, end] = period.split(":");

  try {
    const session = await auth();
    if (!session) throw new Error("unauthorized");

    const query = await prisma.$queryRaw(
      Prisma.sql`SELECT 
                  DATE_TRUNC('hour', "createdAt"::timestamp) AS name,
                  SUM(total) as _sum
                FROM
                  sales
                WHERE
                  "createdAt"::date >= ${start}::date AND "createdAt"::date <= ${end}::date AND "locationId"=${session.location.id}
                GROUP BY
                  name
                ORDER BY
                  name`
    );

    return {
      data: query,
      message: "success",
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
};

export const getRevenueAnalytics = async (period: string) => {
  const [start, end] = period.split(":");

  try {
    const session = await auth();
    if (!session) throw new Error("unauthorized");

    const query = await prisma.$queryRaw(
      Prisma.sql`SELECT 
                  DATE_TRUNC('day', "createdAt"::timestamp) AS name,
                  SUM(total) as _sum
                FROM
                  sales
                WHERE
                  "createdAt"::date >= ${start}::date AND "createdAt"::date <= ${end}::date AND "locationId"=${session.location.id}
                GROUP BY
                  name
                ORDER BY
                  name`
    );

    return {
      data: query,
      message: "success",
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
};

export const getBestSellersAnalytics = async (period: string) => {
  const [start, end] = period.split(":");

  const endDate = new Date(end);
  endDate.setUTCHours(23, 59, 59, 999);

  try {
    const session = await auth();
    if (!session) throw new Error("unauthorized");

    const whereFilter = {
      createdAt: {
        gte: new Date(start),
        lte: new Date(endDate),
      },
      locationId: session.location.id,
    };

    const query = await prisma.lineItem.groupBy({
      by: ["variantId", "title", "variantTitle", "barcode", "productId"],
      where: {
        ...whereFilter,
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 6,
    });

    return {
      data: query,
      message: "success",
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
};

export const getUserAnalytics = async (period: string, key = "employeeId") => {
  const [start, end] = period.split(":");

  const endDate = new Date(end);
  endDate.setUTCHours(23, 59, 59, 999);

  const parsedKey = key as Prisma.SaleScalarFieldEnum;
  try {
    const session = await auth();
    if (!session) throw new Error("unauthorized");

    const whereFilter = {
      createdAt: {
        gte: new Date(start),
        lte: new Date(endDate),
      },
    };

    const query = await prisma.sale.groupBy({
      by: [parsedKey],
      where: {
        ...whereFilter,
        locationId: session.location.id,
      },
      _count: {
        _all: true,
      },
      _sum: {
        total: true,
      },
      orderBy: {
        _sum: {
          total: "desc",
        },
      },
      take: 6,
    });

    const ids = query
      .map((res) => res[parsedKey]!)
      .filter((res) => res) as number[];

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        firstName: true,
        email: true,
        phone: true,
      },
    });

    const mergedData = query.map((item) => {
      const user = users.find((usr) => usr.id === item[parsedKey]);
      return {
        ...item,
        name: user?.firstName,
        email: user?.email,
        phone: user?.phone,
      };
    });

    return {
      data: mergedData,
      message: "success",
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
};
