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
 * get customer
 * @param req
 * @param param1
 * @returns
 */

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = params;

  // const session = decodeJwt(req) as JwtPayload | undefined;

  // if (!session)
  //   return NextResponse.json(
  //     { message: "Missing or invalid credentials" },
  //     { status: 401 }
  //   );

  const user = await prisma.user.findUnique({ where: { id: Number(id) } });

  if (!user) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: sanitize(user) }, { status: 200 });
}

/**
 * update customer
 * @param req
 * @param param1
 * @returns
 */
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    const body = await req.json();

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...body,
      },
    });
    if (!user) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * delete customer
 * @param req
 * @param param1
 * @returns
 */
export async function DELETE({ params }: Params) {
  try {
    const { id } = params;

    const deleted = await prisma.user.delete({ where: { id } });

    if (!deleted) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ data: deleted }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
