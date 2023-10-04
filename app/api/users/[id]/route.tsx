import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize-user";

interface Params {
  params: {
    id: number;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = params;

  const user = await prisma.user.findUnique({ where: { id: Number(id) } });

  if (!user) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ data: sanitize(user) }, { status: 200 });
}

export async function PUT() {
  return NextResponse.json({ message: "PUT User" }, { status: 200 });
}

export async function PATCH() {
  return NextResponse.json({ message: "PATCH User" }, { status: 200 });
}

export async function DELETE() {
  return NextResponse.json({ message: "DELETE User" }, { status: 200 });
}
