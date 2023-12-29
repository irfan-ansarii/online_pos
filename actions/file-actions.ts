"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PAGE_SIZE } from "@/config/app";
import { Prisma } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { writeFile } from "fs/promises";

interface ParamsProps {
  [key: string]: string;
}

/**
 * get files
 * @param params
 * @returns
 */
export async function getFiles(params: ParamsProps) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const { page, search } = params;

    // pagination
    const currentPage = parseInt(page, 10) || 1;

    const offset = (currentPage - 1) * PAGE_SIZE;

    const filters: Prisma.FileWhereInput = {
      OR: [
        {
          title: { contains: search, mode: "insensitive" },
        },
        {
          caption: { contains: search, mode: "insensitive" },
        },
      ],
    };

    // find files
    const files = prisma.file.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      where: { ...filters },
    });

    // get pagination
    const count = prisma.file.count({
      where: { ...filters },
    });

    const [response, pages] = await prisma.$transaction([files, count]);

    // return response
    return {
      data: response,
      pagination: {
        page: currentPage,
        pageSize: PAGE_SIZE,
        pageCount: Math.ceil(pages / PAGE_SIZE),
        pages,
      },
    };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * create files
 * @param params
 * @returns
 */
export async function createFiles(values: HTMLFormElement) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const files = [];

    for (const [_, file] of values.entries()) {
      const { size, type, name } = file;
      const salt = await bcryptjs.genSalt(10);
      const hash = salt.replace(/[/\\?%*:|"<>]/g, "_");

      const [title, extension] = name.split(name[name.lastIndexOf(".")]);

      const transformedTitle = title.replace(/[/\\?%*:|"<>]/g, "_");

      const bytes = await file.arrayBuffer();

      const buffer = Buffer.from(bytes);
      const fileName = `${transformedTitle}_${hash}.${extension}`;
      const src = `/uploads/${fileName}`;
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
      throw new Error("File not found");
    }

    const response = await prisma.file.createMany({
      data: files,
    });

    // return response
    return { data: response, message: "created" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}
