import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const headersList = headers();
  const topic = headersList.get("X-Shopify-Topic");

  if (!topic) return;

  const {
    name,
    id,
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
    tax_lines,
    note,
    line_items,
  } = body;

  // calculate shipping total
  const shippingTotal = shipping_lines.reduce(
    (sum, line) => parseFloat(sum) + parseFloat(line.price),
    0
  );

  if (billing_address?.name) {
  }

  if (shipping_address?.name) {
  }

  const order = {
    locationId: "",
    title: name,
    customerId: "",
    billingAddress,
    shippingAddress,

    createdAt: created_at,
    taxType: taxes_included ? "included" : "excluded",
    subtotal: total_line_items_price,
    totalTax: parseFloat(total_tax.toFixed(2)),
    totalDiscount: parseFloat(totalDiscount.toFixed(2)),
    invoiceTotal: parseFloat(invoiceTotal.toFixed(2)),
    roundedOff: parseFloat(roundedOff.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    totalDue: parseFloat(totalDue.toFixed(2)),
    taxLines,
    status,
  };

  return Response.json(res);
}
