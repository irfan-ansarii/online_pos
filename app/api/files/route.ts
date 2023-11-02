import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { decodeJwt, JwtPayload } from "@/lib/decode-jwt";
import { PAGE_SIZE } from "@/config/app";
import { writeFile } from "fs/promises";
import { join } from "path";
import bcryptjs from "bcryptjs";
import { createHash } from "crypto";
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

  const files = [];

  if (!form) {
    return NextResponse.json({ success: false });
  }

  for (const [_, file] of form.entries()) {
    const { size, type, name } = file;
    const salt = await bcryptjs.genSalt(10);
    const hash = salt.replace(/[/\\?%*:|"<>]/g, "_");

    const [title, extension] = name.split(name[name.lastIndexOf(".")]);

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);
    const fileName = `${title}_${hash}.${extension}`;
    const src = `uploads/${fileName}`;
    const path = `public/${src}`;

    await writeFile(path, buffer);

    const uploadedFiles = {
      title: name,
      caption: name,
      width: 0,
      height: 0,
      ext: "",
      mime: type,
      size: size,
      src: src,
    };

    files.push(uploadedFiles);
  }
  console.log(files);
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
