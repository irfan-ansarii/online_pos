import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { decodeJwt, JwtPayload } from "@/lib/decode-jwt";
import { PAGE_SIZE } from "@/config/app";
import { writeFile } from "fs/promises";
import { join } from "path";

/**
 * GET
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {}

/**
 * POST
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  const form = await req.formData();
  console.log("form:", form);
  for (var pair of form.entries()) {
    console.log(pair[1].length);
  }
  const files: File | null = form.get("files") as unknown | File;
  console.log("files", files);
  if (!files) {
    return NextResponse.json({ success: false });
  }

  const bytes = await files.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const path = join("public", "/", "uploads", files.name);

  await writeFile(path, buffer);

  return NextResponse.json({ success: false });
}

/**
 * PUT
 * @param req
 * @returns
 */
export async function PUT(req: NextRequest) {}

/**
 * DELETE
 * @param req
 * @returns
 */
export async function DELETE(req: NextRequest) {}
