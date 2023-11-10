import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitizeOutput } from "@/lib/utils";

/**
 * get inventory
 * @param req
 * @returns
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { variantId: number | string } }
) {
  try {
    // destructure params
    const { variantId } = params;

    // find inventory
    const variants = await prisma.inventory.findMany({
      where: {
        variantId: Number(variantId),
      },
      include: {
        location: true,
      },
    });

    const sanitized = sanitizeOutput(variants, ["variantId", "locationId"]);

    return NextResponse.json({ data: sanitized }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * update stock
 * @param req
 * @returns
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { variantId: number | string } }
) {
  try {
    const body = await req.json();
    const { id, stock } = body;

    const { variantId } = params;

    const inventory = await prisma.inventory.update({
      where: {
        id: Number(id),
      },
      data: {
        stock: Number(stock),
      },
    });

    const sanitized = sanitizeOutput(inventory, ["variantId", "locationId"]);

    return NextResponse.json({ data: sanitized }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
