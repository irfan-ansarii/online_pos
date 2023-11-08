import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ProductStatus, Prisma } from "@prisma/client";
import { PAGE_SIZE } from "@/config/app";
import { sanitizeOutput } from "@/lib/utils";

/**
 * get products
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
  try {
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
        variants: true,
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
    const sanitizedProducts = sanitizeOutput(products, ["imageId"]);

    // return response
    return NextResponse.json(
      {
        data: sanitizedProducts,
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
      { message: "Internal server error" },
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

    // get all locations
    const locations = await prisma.location.findMany();

    const inventoryToCreate = locations.map((location) => ({
      locationId: location.id,
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
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
