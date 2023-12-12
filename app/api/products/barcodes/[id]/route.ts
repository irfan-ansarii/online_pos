import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/utils";

/**
 * update list item
 * @param req
 * @returns
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { quantity, status } = body;

    const user = await getSession(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // create adjustment
    const response = await prisma.label.update({
      where: { id: Number(id) },
      data: {
        status,
        quantity: Number(quantity),
      },
    });

    // return response
    return NextResponse.json(
      { data: response, message: "updated" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
