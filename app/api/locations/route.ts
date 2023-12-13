import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PAGE_SIZE } from "@/lib/CONSTANTS";
import { getSession } from "@/lib/utils";
/**
 * get locations
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
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

    // find locations
    const locations = await prisma.location.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
    });

    // get pagination
    const total = await prisma.location.count({
      orderBy: {
        createdAt: "desc",
      },
    });

    // return response
    return NextResponse.json(
      {
        data: locations,
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
 * create location
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      type,
      name,
      phone,
      email,
      address,
      address2,
      city,
      state,
      zip,
      country,
    } = body;

    // create location
    const location = await prisma.address.create({
      data: {
        address,
        address2,
        city,
        state,
        zip,
        country,
        location: {
          create: {
            type,
            name,
            email,
            phone,
          },
        },
      },
    });

    // return response
    return NextResponse.json(
      { data: location, message: "created" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
