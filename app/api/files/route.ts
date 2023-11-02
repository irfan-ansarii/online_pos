import bcryptjs from "bcryptjs";
import { writeFile } from "fs/promises";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { decodeJwt, JwtPayload } from "@/lib/decode-jwt";
import { PAGE_SIZE } from "@/config/app";

/**
 * GET
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
  try {
    // get params
    const { searchParams } = req.nextUrl;
    const params = Object.fromEntries([...searchParams.entries()]);

    // destructure params
    const { page, search } = params;

    // pagination
    const currentPage = parseInt(page, 10) || 1;

    const offset = (currentPage - 1) * PAGE_SIZE;

    // find files
    const files = await prisma.file.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
    });

    // get pagination
    const total = await prisma.file.count({
      orderBy: {
        createdAt: "desc",
      },
    });

    // return response
    return NextResponse.json(
      {
        data: files,
        pagination: {
          page: currentPage,
          pageSize: PAGE_SIZE,
          pageCount: Math.ceil(total / PAGE_SIZE),
          total,
        },
      },

      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    // if (!(file instanceof File)) return;
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
      title: title,
      caption: title,
      width: 0,
      height: 0,
      ext: extension,
      mime: type,
      size: size,
      src: src,
    };

    files.push(uploadedFiles);
  }

  if (files.length === 0) {
    return NextResponse.json({ success: false });
  }

  try {
    const response = await prisma.file.createMany({
      data: files,
    });
    return NextResponse.json({ success: false, data: response });
  } catch (err) {
    return NextResponse.json({ success: false });
  }
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
