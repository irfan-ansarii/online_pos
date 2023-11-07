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

    // find product
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        variants: {
          include: {
            inventory: {
              include: { location: true },
            },
          },
        },
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
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
