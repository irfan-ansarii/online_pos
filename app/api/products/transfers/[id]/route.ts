import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/utils";

/**
 * Edit transfer
 * @param req
 * @param param1
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = params;

    const { lineItems, totalItems, totalAmount } = await req.json();

    const user = await getSession(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const transfer = await prisma.transfer.findUnique({
      where: { id: Number(id) },
      include: { lineItems: true },
    });

    if (!transfer) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    //
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", data: error },
      { status: 500 }
    );
  }
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
    const { action } = await req.json();
    const user = await getSession(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const transfer = await prisma.transfer.findUnique({
      where: { id: Number(id) },
      include: { lineItems: true },
    });

    if (!transfer) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    if (transfer.status !== "pending") {
      return NextResponse.json(
        { message: "The entry cannot be edited" },
        { status: 400 }
      );
    }
    const status = action === "remove" ? "cancelled" : "rejected";

    const rejected = await prisma.transfer.update({
      data: {
        status,
        lineItems: {
          updateMany: {
            where: {
              transferId: Number(id),
            },
            data: {
              status,
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
