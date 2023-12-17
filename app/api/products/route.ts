import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ProductStatus, Prisma } from "@prisma/client";
import { PAGE_SIZE } from "@/config/app";
import { getSession, sanitizeOutput } from "@/lib/utils";

/**
 * get products
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getSession(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // get params
    const { searchParams } = req.nextUrl;
    const params = Object.fromEntries([...searchParams.entries()]);

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
                    some: { title: { contains: search, mode: "insensitive" } },
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
        variants: { include: { inventory: { include: { location: true } } } },
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

    // return response
    return NextResponse.json(
      {
        data: products,
        pagination: {
          page: currentPage,
          pageSize: PAGE_SIZE,
          pageCount: Math.ceil(total / PAGE_SIZE),
          total,
        },
      },

      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", details: error },
      { status: 500 }
    );
  }
}

/**
 * create product
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageId, title, description, type, status, variants, options } =
      body;

    const user = await getSession(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // get all locations
    const locations = await prisma.location.findMany();

    const inventoryToCreate = locations.map((location) => ({
      location: { connect: { id: location.id } },
      stock: 0,
    }));

    const variantsToCreate = variants.map(
      (variant: Prisma.VariantCreateInput) => ({
        ...variant,
        purchasePrice: Number(variant.purchasePrice),
        salePrice: Number(variant.salePrice),
        taxRate: Number(variant.taxRate),
        inventory: {
          create: inventoryToCreate,
        },
      })
    );

    // create product and variants
    const product = await prisma.product.create({
      data: {
        title,
        description,
        type,
        status,
        options,
        image: { connect: { id: imageId } },
        variants: {
          create: variantsToCreate,
        },
      },
    });

    // return response
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
