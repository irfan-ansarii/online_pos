"use server";
import prisma from "@/lib/prisma";
import { ProductStatus, Prisma } from "@prisma/client";
import { PAGE_SIZE } from "@/config/app";

function product() {
  async function create() {
    // Implementation of the create function
  }

  async function get(params: any) {
    try {
      // destructure params
      const { page, search, status } = params;

      // pagination
      const currentPage = parseInt(page, 10) || 1;

      const offset = (currentPage - 1) * PAGE_SIZE;

      const filters: Prisma.ProductWhereInput = {
        AND: [
          { status: { equals: (status as ProductStatus) || "active" } },
          {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              {
                OR: [
                  {
                    variants: {
                      some: {
                        title: { contains: search, mode: "insensitive" },
                      },
                    },
                  },
                  {
                    variants: {
                      some: { sku: { contains: search, mode: "insensitive" } },
                    },
                  },
                  {
                    variants: {
                      some: {
                        barcode: {
                          equals: !isNaN(Number(search)) ? Number(search) : -1,
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      // find active products
      const products = await prisma.product.findMany({
        skip: offset,
        take: PAGE_SIZE,
        orderBy: {
          createdAt: "desc",
        },
        where: { ...filters },
        include: {
          variants: {
            include: {
              inventory: {
                include: {
                  location: true,
                },
              },
            },
          },
          image: true,
        },
      });

      // get pagination
      const total = await prisma.product.count({
        orderBy: {
          createdAt: "desc",
        },
        where: { ...filters },
      });
      throw new Error("something went wrong");
      // return response
      return {
        data: products,
        pagination: {
          page: currentPage,
          pageSize: PAGE_SIZE,
          pageCount: Math.ceil(total / PAGE_SIZE),
          total,
        },
      };
    } catch (error: any) {
      const err = error?.response?.data;

      return {
        isError: true,
        isSuccess: false,
        error: err.error,
        message: err.message,
        statusCode: err.response.status,
      };
    }
  }

  async function update() {
    // Implementation of the update function
  }

  async function remove() {
    // Implementation of the delete function
  }

  return {
    create,
    get,
    update,
    remove,
  };
}

export default product;
