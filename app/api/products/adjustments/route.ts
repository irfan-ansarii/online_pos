import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ProductStatus, Prisma } from "@prisma/client";
import { PAGE_SIZE } from "@/config/app";
import { getSession, sanitizeOutput } from "@/lib/utils";

/**
 * get products
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getSession(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // get params
    const { searchParams } = req.nextUrl;
    const params = Object.fromEntries([...searchParams.entries()]);

    // destructure params
    const { page, search, status } = params;

    // pagination
    const currentPage = parseInt(page, 10) || 1;

    const offset = (currentPage - 1) * PAGE_SIZE;

    // find adjustments
    const response = await prisma.adjustment.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      where: { locationId: Number(user?.locationId) },
    });

    // get pagination
    const total = await prisma.adjustment.count({
      orderBy: {
        createdAt: "desc",
      },
      where: { locationId: Number(user?.locationId) },
    });

    // return response
    return NextResponse.json(
      {
        data: response,
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
 * create adjustments
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lineItems, reason } = body;

    const user = await getSession(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // create adjustment
    const response = await prisma.adjustment.createMany({
      data: lineItems.map((item: Prisma.AdjustmentCreateInput) => ({
        locationId: user.locationId,
        variantId: item.variantId,
        title: item.title,
        sku: item.sku,
        variantTitle: item.variantTitle,
        quantity: item.quantity,
        reason,
        imageId: item.imageId,
      })),
    });

    for (const item of lineItems) {
      const inventory = await prisma.inventory.updateMany({
        where: {
          AND: [
            { locationId: Number(user.locationId) },
            { variantId: Number(item.variantId) },
          ],
        },
        data: { stock: { increment: Number(item.quantity) } },
      });
      if (!inventory) {
        await prisma.inventory.create({
          data: {
            locationId: Number(user.locationId),
            variantId: Number(item.variantId),
            stock: Number(item.quantity),
          },
        });
      }
    }

    // return response
    return NextResponse.json(
      { data: response, message: "Created" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
