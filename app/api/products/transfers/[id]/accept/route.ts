import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * create product
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { id, lineItems } = body;

    if (!lineItems || lineItems.length <= 0) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    const transfer = await prisma.transfer.findUnique({
      where: {
        id: id,
      },
      include: {
        lineItems: true,
      },
    });

    for (const item of lineItems) {
      // increase stock from the source

      await prisma.inventory.updateMany({
        data: {
          stock: { increment: Number(item.quantity) },
        },
        where: {
          AND: [
            { locationId: Number(transfer?.toId) },
            { variantId: Number(item.variantId) },
          ],
        },
      });

      // completed line items
      await prisma.transferLineItem.updateMany({
        data: {
          status: "completed",
        },
        where: {
          AND: [
            { transferId: Number(transfer?.id) },
            { variantId: Number(item.variantId) },
          ],
        },
      });
    }

    // update transfers
    await prisma.transfer.update({
      data: {
        status: "completed",
      },
      where: {
        id: transfer?.id,
      },
    });

    // return response
    return NextResponse.json({ data: "" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
