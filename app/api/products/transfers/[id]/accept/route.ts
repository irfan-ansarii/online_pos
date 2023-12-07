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
    const { lineItems, destination } = body;

    if (!lineItems || lineItems.length <= 0) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // get session location

    // create or update inventory for the destination

    // update transfer line items

    // update transfers

    // return response
    return NextResponse.json({ data: "" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
