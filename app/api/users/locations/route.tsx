import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize-user";
import { PAGE_SIZE } from "@/lib/CONSTANTS";

/**
 * swicth location
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { locationId } = body;

    if (!locationId) {
      return NextResponse.json(
        { message: "Location id is required" },
        { status: 400 }
      );
    }

    // TODO
    // check if user role is admin

    // update user location
    const location = await prisma.user.update({
      where: {
        id: 1,
      },
      data: {
        locationId,
      },
    });

    // return response
    return NextResponse.json(
      { message: "Success", data: location },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
