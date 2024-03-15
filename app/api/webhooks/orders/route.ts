import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { createContact } from "@/actions/contact-actions";
import { createTransactions } from "@/actions/sale-actions";
import { Address } from "@prisma/client";
import Shopify from "shopify-api-node";

interface CustomerProps {
  firstName: string;
  lastName: string | null;
  phone: string;
  email: string | null;
  role: string;
  addresses?: Address[];
}

const initShopify = async (domain: string) => {
  const location = await prisma.location.findFirst({
    where: { storeUrl: domain },
  });

  return new Shopify({
    shopName: location?.storeUrl!,
    accessToken: location?.apiKey!,
  });
};

const findProductBySku = async (sku: string) => {
  try {
    const product = await prisma.variant.findFirst({
      where: { sku: sku },
      include: { product: true },
    });
    return product;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/**
 * create or update customer
 * @param args
 * @returns
 */
const findOrCreateCustomer = async (args: CustomerProps) => {
  const { firstName, lastName, phone, email } = args;

  try {
    const customer = await prisma.user.findFirst({
      where: { OR: [{ phone }, { email }] },
    });

    if (customer) return customer.id;

    const createdCustomer = await createContact({
      firstName,
      lastName,
      phone,
      role: "customer",
      email,
    });

    return createdCustomer.data.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

/** create or update customer address */

const findOrCreateCustomerAddress = async (
  add: any,
  email: string | undefined
) => {
  const {
    first_name,
    last_name,
    company,
    phone,
    address,
    address2,
    city,
    province,
    zip,
    country,
  } = add;

  let existingAddress;

  existingAddress = await prisma.address.findFirst({
    where: {
      OR: [
        {
          address: {
            endsWith: "prisma.io",
          },
        },
        { address2: { endsWith: "gmail.com" } },
      ],
    },
  });

  if (!existingAddress) {
    await prisma.address.create({
      data: {
        company,
        address,
        address2,
        city,
        state: province,
        zip,
        country,
      },
    });
  }

  const billing = [`${first_name} ${last_name}`];
  billing[1] = `${company}`;
  billing[2] = `${address} ${address2 ? address2 : ""}`;
  billing[3] = `${city} ${province} ${zip}`;
  billing[4] = `${phone}`;
  billing[5] = `${email}`;

  return billing.filter((b) => b);
};

/**
 * process line items
 * @param lineItem
 * @param locationId
 * @param shopify
 * @returns
 */
const processLineItem = async (
  lineItem: any,
  locationId: number,
  shopify: Shopify
) => {
  const {
    title,
    variant_title,
    sku,
    barcode,
    price,
    variant_id,
    tax_lines,
    quantity,
    requires_shipping,
    fulfillable_quantity,
    discount_allocations,
  } = lineItem;

  /** get variant from db */
  const variant = await findProductBySku(lineItem.sku);

  /** get variant from shopify */
  const productVariant = await shopify.productVariant.get(variant_id);

  /** calculate tax rate */
  const taxRate = tax_lines.reduce((acc: number, curr: any) => {
    acc += curr.rate;
    return acc;
  }, 0);

  /** calculate discount  */
  const discount = discount_allocations?.reduce((acc: number, curr: any) => {
    acc += parseFloat(curr.amount);
    return acc;
  }, 0);

  /** calculate tax */
  const totalTax = tax_lines.reduce((acc: number, curr: any) => {
    acc += parseFloat(curr.price);
    return acc;
  }, 0);

  return {
    locationId: locationId,
    productId: variant?.product?.id,
    variantId: variant?.id,
    title: title,
    variantTitle: variant_title,
    sku: sku,
    hsn: variant?.hsn,
    barcode: barcode || variant?.barcode,
    originalPrice: productVariant?.compare_at_price || price,
    price: price,
    taxRate: taxRate * 100,
    quantity: quantity,
    needShipping: requires_shipping,
    shippingQuantity: fulfillable_quantity,
    totalDiscount: discount,
    totalTax,
    total: price * quantity,
    taxLines: tax_lines,
  };
};

/** handler */
export async function POST(req: NextRequest) {
  const body = await req.json();

  const headersList = headers();

  const topic = headersList.get("X-Shopify-Topic");
  const domain = headersList.get("X-Shopify-Shop-Domain");
  const webhookId = headersList.get("X-Shopify-Webhook-Id");

  if (!topic || !domain || !webhookId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const {
    id,
    name,
    created_at,
    cancelled_at,
    total_line_items_price,
    total_discounts,
    total_tax,
    taxes_included,
    shipping_lines,
    total_price,
    billing_address,
    shipping_address,
    customer,
    total_outstanding,
    fulfillment_status,
    financial_status,
    tax_lines,
    note,
    line_items,
  } = body;

  /** init shopify instance */
  const shopify = await initShopify(domain);

  /** get location id */
  const location = await prisma.location.findFirst({
    where: { storeUrl: domain },
  });

  if (!location) return;

  /** check if sale already exist */
  const existingSale = await prisma.sale.findFirst({
    where: {
      title: name,
      locationId: location.id,
    },
  });

  if (existingSale) return;

  const lineItems = await Promise.all(
    line_items.map(
      async (lineItem: any) =>
        await processLineItem(lineItem, location.id, shopify)
    )
  );

  /** calculate shipping total */
  const shippingTotal = shipping_lines.reduce(
    (acc: string, curr: any) => parseFloat(acc) + parseFloat(curr.price),
    0
  );

  const customerId = await findOrCreateCustomer(customer);

  const parsedBillingAddress = await findOrCreateCustomerAddress(
    billing_address,
    customer?.email
  );
  const parsedShippingAddress = await findOrCreateCustomerAddress(
    shipping_address,
    customer?.email
  );

  let shipmentStatus = "";

  if (cancelled_at) shipmentStatus = "cancelled";
  if (fulfillment_status === "restocked") return "returned";
  if (fulfillment_status === "fulfilled") return "delivered";

  const createdSale = await prisma.sale.create({
    data: {
      locationId: location.id,
      title: name,
      customerId,
      billingAddress: parsedBillingAddress,
      shippingAddress: parsedShippingAddress,
      createdAt: created_at,
      taxType: taxes_included ? "included" : "excluded",
      subtotal: total_line_items_price,
      totalTax: parseFloat(total_tax.toFixed(2)),
      totalDiscount: parseFloat(total_discounts.toFixed(2)),
      chargesLines: shipping_lines,
      chargesTotal: shippingTotal,
      invoiceTotal: parseFloat(total_price.toFixed(2)),
      total: parseFloat(total_price.toFixed(2)),
      totalDue: parseFloat(total_outstanding.toFixed(2)),
      taxLines: tax_lines,
      notes: note,
      status: financial_status,
      shippingStatus: shipmentStatus,
      lineItems: {
        createMany: { data: lineItems },
      },
    },
  });

  const transactionslist = await shopify.transaction.list(id);

  const filteredtransactions = transactionslist.filter(
    (transaction) => transaction.status === "success"
  );

  await createTransactions({
    saleId: createdSale.id,
    data: filteredtransactions,
  });

  return NextResponse.json({ data: "", status: 200 });
}
