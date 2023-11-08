import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitizeOutput } from "@/lib/utils";

/**
 * get products
 * @param req
 * @returns
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  console.log(params);
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

    if (!product) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const sanitizedProduct = sanitizeOutput(product, ["imageId"]);

    // return response
    return NextResponse.json({ data: sanitizedProduct }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Edit product
 * @param req
 * @param param1
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  console.log(params);
}

/**
 * delete product
 * @param req
 * @param param1
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  const { id } = params;

  // delete variants
  await prisma.variant.deleteMany({
    where: { productId: Number(id) },
  });

  // delete product
  await prisma.product.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ message: "deleted", status: 204 });
}
