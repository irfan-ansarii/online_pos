import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize-user";
import { getSession } from "@/lib/utils";

interface Params {
  params: {
    id: number | string;
  };
}

/**
 * get customer
 * @param req
 * @param param1
 * @returns
 */

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;

    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userTransaction = prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        customer: {
          orderBy: { createdAt: "desc" },
        },
        addresses: true,
      },
    });

    const totalTransaction = prisma.sale.aggregate({
      where: {
        customerId: Number(id),
      },
      _sum: {
        total: true,
      },
      _avg: {
        total: true,
      },
      _count: {
        total: true,
      },
    });
    const response = await prisma.$transaction([
      userTransaction,
      totalTransaction,
    ]);

    if (!response) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const sanitized = sanitize(response[0]);
    const transformed = {
      ...sanitized,
      customer: id,
      orders: response[0]?.customer,
      ...response[1],
    };

    return NextResponse.json({ data: transformed }, { status: 200 });
  } catch (error) {
    console.log(error);
  }
}

/**
 * update customer
 * @param req
 * @param param1
 * @returns
 */
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const body = await req.json();

    const { firstName, lastName, phone, email, addresses } = body;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const res = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        firstName,
        lastName,
        phone,
        email,
        addresses: {
          upsert: addresses.map((add: any) => ({
            where: {
              id: add.id,
            },
            update: {
              company: add.company,
              address: add.address,
              address2: add.address2,
              city: add.city,
              state: add.state,
              zip: add.zip,
              country: add.country,
            },
            create: {
              company: add.company,
              address2: add.address2,
              city: add.city,
              state: add.state,
              zip: add.zip,
              country: add.country,
            },
          })),
        },
      },
    });

    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
