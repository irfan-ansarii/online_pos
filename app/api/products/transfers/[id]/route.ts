import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Edit transfer
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
 * reject transfer
 * @param req
 * @param param1
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = params;

    const transfer = await prisma.transfer.findUnique({
      where: { id: Number(id) },
      include: { lineItems: true },
    });

    if (!transfer || transfer.status !== "pending") {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const rejected = await prisma.transfer.update({
      data: {
        status: "rejected",
        lineItems: {
          updateMany: {
            where: {
              transferId: Number(id),
            },
            data: {
              status: "completed",
            },
          },
        },
      },
      where: { id: Number(id) },
    });

    //  restock items
    for (const item of transfer.lineItems) {
      await prisma.inventory.updateMany({
        data: {
          stock: { increment: item.quantity },
        },
        where: {
          AND: [{ locationId: transfer.fromId }, { variantId: item.variantId }],
        },
      });
    }

    return NextResponse.json({ data: rejected, status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", data: error },
      { status: 500 }
    );
  }
}
