import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { PAGE_SIZE } from "@/config/app";
/**
 * get products
 * @param req
 * @returns
 */
export async function GET(req: NextRequest, { params }) {
  try {
    // destructure params
    const { id } = params;

    // find product
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        variants: true,
        image: true,
      },
    });

    // return response
    return NextResponse.json(
      {
        data: product,
      },

      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
