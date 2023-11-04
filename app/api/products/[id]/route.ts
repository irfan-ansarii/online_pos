import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * get products
 * @param req
 * @returns
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    // destructure params
    const { id } = params;
    console.log(id);
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

    // TODO
    // find and append inventory of the product

    // return response
    return NextResponse.json(
      {
        data: product,
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
