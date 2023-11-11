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
  try {
    // destructure params
    const { id } = params;

    // find product
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        variants: { include: { inventory: { include: { location: true } } } },
        image: true,
      },
    });

    // if product not found
    if (!product) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // remove imageId key from response
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

  const variants = await prisma.variant.findMany({
    where: { productId: Number(id) },
  });

  const recordsToDelete = variants.map((variant) => variant.id);

  const deleteInventory = prisma.inventory.deleteMany({
    where: { variantId: { in: recordsToDelete } },
  });

  const deleteVariants = prisma.variant.deleteMany({
    where: { productId: Number(id) },
  });

  const deleteProduct = prisma.product.delete({
    where: { id: Number(id) },
  });

  const transaction = await prisma.$transaction([
    deleteInventory,
    deleteVariants,
    deleteProduct,
  ]);

  return NextResponse.json({ message: "deleted", status: 204 });
}
