import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/utils";

/**
 * accept transfer
 * @param req
 * @returns
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const body = await req.json();
    const { id } = params;
    const { lineItems } = body;

    const user = await getSession(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!lineItems || lineItems.length < 1 || !id) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    for (const item of lineItems) {
      // increase stock to destination location
      await prisma.inventory.updateMany({
        data: {
          stock: { increment: Number(item.quantity) },
        },
        where: {
          AND: [
            { locationId: Number(item.toId) },
            { variantId: Number(item.variantId) },
          ],
        },
      });

      // completed line items
      await prisma.transferLineItem.updateMany({
        data: {
          status: "accepted",
        },
        where: {
          AND: [
            { transferId: Number(id) },
            { variantId: Number(item.variantId) },
          ],
        },
      });
    }

    // find one transfer
    const transfer = await prisma.transfer.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        lineItems: true,
      },
    });

    // check if all the items are accepted
    const isCompleted = transfer?.lineItems.every(
      (item) => item.status == "accepted"
    );

    // update transfer
    const updatedTransfer = prisma.transfer.update({
      data: {
        status: isCompleted ? "accepted" : "partial",
      },
      where: {
        id: id,
      },
    });

    // return response
    return NextResponse.json({ data: updatedTransfer }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}