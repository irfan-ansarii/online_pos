import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PAGE_SIZE } from "@/config/app";
import { getSession } from "@/lib/utils";

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
    const { page, search } = params;

    // pagination
    const currentPage = parseInt(page, 10) || 1;

    const offset = (currentPage - 1) * PAGE_SIZE;

    const filters: Prisma.AdjustmentWhereInput = {
      AND: [
        { locationId: Number(user?.locationId) },
        {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { variantTitle: { contains: search, mode: "insensitive" } },
            { sku: { contains: search, mode: "insensitive" } },
          ],
        },
      ],
    };

    // find adjustments
    const response = await prisma.adjustment.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      where: { ...filters },
      include: { image: true },
    });

    // get pagination
    const total = await prisma.adjustment.count({
      orderBy: {
        createdAt: "desc",
      },
      where: { ...filters },
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
 * create adjustment
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lineItems, reason, locationId } = body;

    const user = await getSession(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const location = !isNaN(locationId) ? Number(locationId) : user.locationId;

    // create adjustment
    const response = await prisma.adjustment.createMany({
      data: lineItems.map((item: any) => ({
        locationId: location,
        variantId: item.variantId,
        title: item.title,
        sku: item.sku,
        variantTitle: item.variantTitle,
        quantity: Number(item.quantity),
        reason,
        imageId: item.imageId,
      })),
    });

    for (const item of lineItems) {
      const inventory = await prisma.inventory.updateMany({
        where: {
          AND: [
            { locationId: location! },
            { variantId: Number(item.variantId) },
          ],
        },
        data: { stock: { increment: Number(item.quantity) } },
      });

      if (!inventory) {
        await prisma.inventory.create({
          data: {
            locationId: location!,
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
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
