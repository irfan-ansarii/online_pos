import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { decodeJwt, JwtPayload } from "@/lib/decode-jwt";

/**
 * swicth location
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { locationId } = body;

    const session = decodeJwt(req) as JwtPayload | undefined;

    if (!session)
      return NextResponse.json(
        { message: "Missing or invalid credentials" },
        { status: 401 }
      );

    if (session.role === "admin") {
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
      return NextResponse.json({ data: location }, { status: 200 });
    }

    return NextResponse.json({ message: "Permission Denied" }, { status: 403 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
