"use server";

import prisma from "@/lib/prisma";
import { Prisma, Product, ProductStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { PAGE_SIZE } from "@/config/app";

interface ParamsProps {
  [key: string]: string;
}

/**
 * get products
 * @param params
 * @returns
 */
export async function getProducts(params: ParamsProps) {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const { page, search, status } = params;

    // pagination
    const currentPage = parseInt(page, 10) || 1;

    const offset = (currentPage - 1) * PAGE_SIZE;

    const filters: Prisma.ProductWhereInput = {
      AND: [
        { status: { equals: (status as ProductStatus) || "active" } },
        {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        },
      ],
    };

    // find active products
    const products = await prisma.product.findMany({
      skip: offset,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: "desc",
      },
      where: { ...filters },
      include: {
        variants: {
          include: {
            inventory: {
              include: {
                location: true,
              },
              orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            },
          },
        },
        image: true,
      },
    });

    // get pagination
    const total = await prisma.product.count({
      where: { ...filters },
    });

    // return response
    return {
      data: products,
      pagination: {
        page: currentPage,
        pageSize: PAGE_SIZE,
        pageCount: Math.ceil(total / PAGE_SIZE),
        total,
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
 * create product
 * @param values
 * @returns
 */

export async function createProduct(values: any) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const { imageId, title, description, type, status, variants, options } =
      values;

    // get all locations
    const locations = await prisma.location.findMany();

    const inventoryToCreate = locations.map((location) => ({
      location: { connect: { id: location.id } },
      stock: 0,
    }));

    const variantsToCreate = variants.map(
      (variant: Prisma.VariantCreateInput) => ({
        ...variant,
        purchasePrice: Number(variant.purchasePrice),
        salePrice: Number(variant.salePrice),
        taxRate: Number(variant.taxRate),
        inventory: {
          create: inventoryToCreate,
        },
      })
    );

    // create product and variants
    const product = await prisma.product.create({
      data: {
        title,
        description,
        type,
        status,
        options: options || undefined,
        image: { connect: { id: imageId } },
        variants: {
          create: variantsToCreate,
        },
      },
      include: { variants: true },
    });

    const { variants: createdVariants } = product;

    for (const variant of createdVariants) {
      const { id, sku } = variant;

      // generate barcode with prefix and suffix
      const barcode = `GN${`${id}`.padStart(6, "0")}`;

      await prisma.variant.update({
        data: { sku: sku || barcode, barcode },
        where: {
          id: id,
        },
      });
    }

    // return response
    return { data: product, message: "created" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 * update product
 * @param values
 * @returns
 */

export async function updateProduct(values: any) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const { id, imageId, title, description, type, status, variants, options } =
      values;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!product) {
      throw new Error("Not found");
    }
    // get all locations
    const locations = await prisma.location.findMany();

    const inventoryToCreate = locations.map((location) => ({
      location: { connect: { id: location.id } },
      stock: 0,
    }));

    const prismaTransactions = [];
    const itemsToDelete = [];

    // get id of the variants to be deleted
    for (const variant of product.variants) {
      const index = variants.findIndex((v: any) => v.itemId === variant.id);
      if (index === -1) itemsToDelete.push(variant.id);
    }

    // update product
    prismaTransactions.push(
      prisma.product.update({
        where: { id },
        data: {
          title,
          description,
          type,
          status,
          options: options || undefined,
          image: { connect: { id: imageId } },
        },
        include: { variants: true },
      })
    );
    // delete variants
    prismaTransactions.push(
      prisma.variant.deleteMany({
        where: {
          id: { in: itemsToDelete },
        },
      })
    );

    // create or update variants
    for (const variant of variants) {
      prismaTransactions.push(
        prisma.variant.upsert({
          where: { id: variant.itemId || -1 },
          update: {
            title: variant.title,
            option: variant.option,
            sku: variant.sku,
            hsn: variant.hsn,
            purchasePrice: Number(variant.purchasePrice),
            salePrice: Number(variant.salePrice),
            taxRate: Number(variant.taxRate),
          },
          create: {
            productId: id,
            title: variant.title,
            option: variant.option,
            sku: variant.sku,
            hsn: variant.hsn,
            purchasePrice: Number(variant.purchasePrice),
            salePrice: Number(variant.salePrice),
            taxRate: Number(variant.taxRate),
            inventory: {
              create: inventoryToCreate,
            },
          },
        })
      );
    }

    const [updatedProduct] = await prisma.$transaction(prismaTransactions);

    // @ts-ignore
    for (const variant of updatedProduct?.variants) {
      const { id, sku, barcode } = variant;

      if (!barcode) {
        const generatedBarcode = `GN${`${id}`.padStart(6, "0")}`;
        await prisma.variant.update({
          data: { sku: sku || generatedBarcode, barcode: generatedBarcode },
          where: {
            id: id,
          },
        });
      }
    }

    return { data: updatedProduct, message: "updated" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

/**
 *
 * @param id
 * @returns
 */
export async function getProduct(id: number) {
  try {
    const session = await auth();

    if (!session) {
      throw new Error("Unauthorized");
    }

    // find product
    const product = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        variants: {
          include: { inventory: { include: { location: true } } },
        },
        image: true,
      },
    });

    // if product not found
    if (!product) {
      throw new Error("Not found");
    }

    // return response
    return { data: product, message: "success" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}

export async function deleteProduct(id: number) {
  try {
    const session = await auth();
    if (!session || typeof session === "string") {
      throw new Error("Unauthorized");
    }

    const deleteProduct = await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    return { data: deleteProduct, message: "success" };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new Error("Internal server error");
    }
    throw new Error(error.message);
  }
}
