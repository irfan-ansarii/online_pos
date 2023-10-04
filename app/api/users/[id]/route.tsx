import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize-user";

interface Params {
  params: {
    id: number;
  };
}

/**
 * get user
 * @param req
 * @param param1
 * @returns
 */
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = params;

  const user = await prisma.user.findUnique({ where: { id: Number(id) } });

  if (!user) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: sanitize(user) }, { status: 200 });
}

/**
 * update user
 * @param req
 * @param param1
 * @returns
 */
export async function PUT(req: NextRequest, { params }: Params) {
  return NextResponse.json({ message: "PUT User" }, { status: 200 });
}

/**
 * delete user
 * @param req
 * @param param1
 * @returns
 */
export async function DELETE(req: NextRequest, { params }: Params) {
  return NextResponse.json({ message: "DELETE User" }, { status: 200 });
}
