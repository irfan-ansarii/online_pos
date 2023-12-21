import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/utils";

/**
 * print
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getSession(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // find adjustment
    const response = await prisma.label.findMany({
      where: { status: "pending" },
    });

    // return response
    return NextResponse.json(
      { data: response, message: "entry" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
