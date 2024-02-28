import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { createContact } from "@/actions/contact-actions";

import { Address, User } from "@prisma/client";

import Shopify from 'shopify-api-node';
import { createTransactions } from "@/actions/sale-actions";

interface CustomerProps extends User {
  addresses?: Address[];
}


const initShopify = async (domain:string) => {
  const location = await prisma.location.findFirst({
    where: { storeUrl: domain },
  });
  
  return  new Shopify({
  shopName: location?.storeUrl!,
  accessToken: location?.apiKey!
});
}

const findOrCreateCustomer = async (args: CustomerProps) => {
  const { firstName, lastName, phone, email, addresses } = args;

  const customer = await prisma.user.findFirst({
    where: { OR: [{ phone }, { email }] },
  });

  if (!customer) {
    const customer = await createContact({
      firstName,
      lastName,
      phone,
      role: "customer",
      email,
    });

    return customer;
  }

  return customer;
};

const getShipmentStatus = (status: string | null) => {
  if (status === "restocked") return "returned";
  if (status === "fulfilled") return "delivered";
  return "";
};

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();

  const headersList = headers();

  /** shopify headers */
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

  /** check if location matches */
  const location = await prisma.location.findFirst({
    where: { storeUrl: domain },
  });

  if (!location) return;

  /** check if sale already exists */
  const existingSale = await prisma.sale.findFirst({
    where: {
      title: name,
      locationId: location.id,
    },
  });

  if (existingSale) return;

  /** calculate shipping total */
  const shippingTotal = shipping_lines.reduce(
    (acc: string, curr: any) => parseFloat(acc) + parseFloat(curr.price),
    0
  );


  const lineItems = line_items.map(() => ({
    "fulfillable_quantity": 1,
      "fulfillment_service": "amazon",
      "fulfillment_status": "fulfilled",
      "grams": 500,
      "id": 669751112,
      "price": "199.99",
      "product_id": 7513594,
      "quantity": 1,
      "current_quantity": 1,
      "requires_shipping": true,
      "sku": "IPOD-342-N",
      "title": "IPod Nano",
      "variant_id": 4264112,
      "variant_title": "Pink",
      "vendor": "Apple",
      "name": "IPod Nano - Pink",
      "gift_card": false,
      "price_set": {
        "shop_money": {
          "amount": "199.99",
          "currency_code": "USD"
        },
        "presentment_money": {
          "amount": "173.30",
          "currency_code": "EUR"
        }
      },
      "properties": [
        {
          "name": "custom engraving",
          "value": "Happy Birthday Mom!"
        }
      ],
      "taxable": true,
      "tax_lines": [
        {
          "title": "HST",
          "price": "25.81",
          "price_set": {
            "shop_money": {
              "amount": "25.81",
              "currency_code": "USD"
            },
            "presentment_money": {
              "amount": "20.15",
              "currency_code": "EUR"
            }
          },
          "channel_liable": true,
          "rate": 0.13
        }
      ],
      "total_discount": "5.00",
      "total_discount_set": {
        "shop_money": {
          "amount": "5.00",
          "currency_code": "USD"
        },
        "presentment_money": {
          "amount": "4.30",
          "currency_code": "EUR"
        }
      },
      "discount_allocations": [
        {
          "amount": "5.00",
          "discount_application_index": 2,
          "amount_set": {
            "shop_money": {
              "amount": "5.00",
              "currency_code": "USD"
            },
            "presentment_money": {
              "amount": "3.96",
              "currency_code": "EUR"
            }
          }
        }
    ],
      
      locationId       :location.id
  productId        Int?
  variantId        Int?
  title            String
  variantTitle     String?
  sku              String?
  hsn              String?
  barcode          String?
  originalPrice    Decimal?
  price            Float
  taxRate          Int
  kind             String             @default("sale") // sale|return
  quantity         Int
  needShipping     Boolean            @default(false)
  shippingQuantity Int                @default(0)
  totalDiscount    Float
  totalTax         Float
  total            Float
  taxLines 

  }))

  /** create order with line items */
  const createdSale = await prisma.sale.create({
    data: {
      locationId: location.id,
      title: name,
      customerId: undefined,
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
      shippingStatus: cancelled_at
        ? "cancelled"
        : getShipmentStatus(fulfillment_status),
    },
  });

  /** get shopify transactions */

  const shopify = await initShopify(domain);

  const transactionslist = await shopify.transaction.list(id);

  const filteredtransactions = transactionslist.filter((transaction) => transaction.status === 'success');

  await createTransactions({saleId: createdSale.id, data:filteredtransactions})


  return NextResponse.json({ data:  '', status: 200});
}
