import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: {
    id: string;
  };
}
export async function GET(req: NextRequest, { params }: Params) {
  return NextResponse.json({ message: "Get User" }, { status: 200 });
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
