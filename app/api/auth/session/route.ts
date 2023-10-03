import { NextRequest, NextResponse } from "next/server";
import { getTokenData } from "@/lib/get-token-data";

export async function GET(req: NextRequest) {
  console.log(getTokenData);
}
