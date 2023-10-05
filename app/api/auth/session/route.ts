import { NextRequest, NextResponse } from "next/server";
import { decodeJwt, JwtPayload } from "@/lib/decode-jwt";
import prisma from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize-user";

export async function GET(req: NextRequest) {
  try {
    const session = decodeJwt(req) as JwtPayload | undefined;

    if (!session)
      return NextResponse.json(
        { message: "Missing or invalid credentials" },
        { status: 401 }
      );

    const user = await prisma.user.findUnique({
      where: {
        id: session.id,
      },
      include: {
        location: true,
      },
    });

    return NextResponse.json({ data: sanitize(user) }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
