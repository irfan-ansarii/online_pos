import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/utils";

/**
 * reject or cancel
 * @param req
 * @param param1
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = params;
    const { status } = await req.json();
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

    const queries = [];
    const transferQuery = prisma.transfer.update({
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

    queries.push(transferQuery);

    //  restock items
    for (const item of transfer.lineItems) {
      const inventoryQuery = prisma.inventory.updateMany({
        data: {
          stock: { increment: item.quantity },
        },
        where: {
          AND: [{ locationId: transfer.fromId }, { variantId: item.variantId }],
        },
      });
      queries.push(inventoryQuery);
    }

    const response = prisma.$transaction(queries);
    console.log(response);

    return NextResponse.json({ data: response, status: 204 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error", data: error },
      { status: 500 }
    );
  }
}
