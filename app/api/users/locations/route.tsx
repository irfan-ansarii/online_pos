import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/utils";

/**
 * swicth location
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "admin") {
      return NextResponse.json({ message: "Access Denied" }, { status: 403 });
    }
    const body = await req.json();
    const { locationId } = body;

    const location = await prisma.user.update({
      where: {
        id: session.id,
      },
      data: {
        locationId,
      },
      include: {
        location: true,
      },
    });
    return NextResponse.json(
      { data: location, message: "updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
