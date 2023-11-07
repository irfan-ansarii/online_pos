import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { PAGE_SIZE } from "@/config/app";
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

    // find active products
    const products = await prisma.product.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        status: { equals: "active" },
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      },
      include: {
        variants: {
          include: {
            inventory: true,
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
      where: {
        status: { equals: "active" },
      },
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
          create: variants.map((variant: any) => {
            return {
              ...variant,
              purchasePrice: Number(variant.purchasePrice),
              salePrice: Number(variant.salePrice),
              taxRate: Number(variant.taxRate),
            };
          }),
        },
      },
    });

    // return response
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
