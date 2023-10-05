import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize-user";
import { decodeJwt, JwtPayload } from "@/lib/decode-jwt";
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
  const { id } = params;

  const body = await req.json();

  const session = decodeJwt(req) as JwtPayload | undefined;

  if (!session)
    return NextResponse.json(
      { message: "Missing or invalid credentials" },
      { status: 401 }
    );

  if (session.role === "admin") {
    const { role, status } = body;
  }

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: {
      ...body,
    },
  });

  return NextResponse.json({ data: user }, { status: 200 });
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
