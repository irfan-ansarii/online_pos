"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PAGE_SIZE } from "@/config/app";
import { Prisma } from "@prisma/client";

export const getSaleAnalytics = async (period: string) => {
  const [start, end] = period.split(":");

  const sale = await prisma.sale.aggregate({
    where: {
      AND: [
        {
          createdAt: {
            gte: new Date(start),
          },
        },
        {
          createdAt: {
            lte: new Date(end),
          },
        },
      ],
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
  return {
    data: sale,
    message: "success",
  };
};

export const getPurchaseAnalytics = async (period: string) => {
  const [start, end] = period?.split(":");

  const sale = await prisma.purchase.aggregate({
    where: {
      AND: [
        {
          createdAt: {
            gte: new Date(start),
          },
        },
        {
          createdAt: {
            lte: new Date(end),
          },
        },
      ],
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
  return {
    data: sale,
    message: "success",
  };
};

export const getInventoryAnalytics = async (period: string) => {
  const [start, end] = period?.split(":");

  const sale = await prisma.sale.groupBy({
    by: ["createdAt"],
    where: {
      AND: [
        {
          createdAt: {
            gte: new Date(start),
          },
        },
        {
          createdAt: {
            lte: new Date(end),
          },
        },
      ],
    },
    _count: {
      _all: true,
    },
    _avg: {
      total: true,
    },
    _sum: {
      total: true,
    },
  });
  console.log(sale);
  return {
    data: sale,
    message: "success",
  };
};

/**
 * get new customers
 * @param period
 * @returns
 */
export const getCustomersAnalytics = async (period: string) => {
  const [start, end] = period?.split(":");

  const customer = await prisma.user.aggregate({
    where: {
      AND: [
        {
          createdAt: {
            gte: new Date(start),
          },
        },
        {
          createdAt: {
            lte: new Date(end),
          },
        },
      ],
    },
    _count: {
      _all: true,
    },
  });
  return {
    data: customer,
    message: "success",
  };
};
