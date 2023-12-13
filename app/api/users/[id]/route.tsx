import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize-user";

import { getSession } from "@/lib/utils";
interface Params {
  params: {
    id: number;
  };
}

/**
 * update user
 * @param req
 * @param param1
 * @returns
 */
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const body = await req.json();

    const { firstName, lastName, role, status, locationId } = body;

    if (session.role !== "admin") {
      return NextResponse.json({ message: "Access Denied" }, { status: 403 });
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        firstName,
        lastName,

        role,
        status,
        locationId: Number(locationId),
      },
    });

    return NextResponse.json(
      { data: user, message: "updated" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
