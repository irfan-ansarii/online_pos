import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const headersList = headers();

  const topic = headersList.get("token");

  console.log(body, topic);
  return "ok";
  const {
    name,
    id,
    created_at,
    cancelled_at,
    cancel_reason,
    total_line_items_price,
    total_discounts,
    total_tax,
    shipping_lines,
    total_price,
    total_outstanding,
    billing_address,
    shipping_address,
    discount_codes,
    customer,
    tax_lines,
    note,
    line_items,
    fulfillment_status,
    fulfillments,
  } = body;

  let fulfillmentOrders = null;

  // calculate shipping total
  const shippingTotal = shipping_lines.reduce(
    (sum, line) => parseFloat(sum) + parseFloat(line.price),
    0
  );

  if (billing_address?.name) {
    billing_address.phone = strapi
      .service("api::customer.customer")
      .formatPhoneNumber(
        billing_address?.phone ||
          shipping_address?.phone ||
          customerEntity?.phone,
        billing_address.country_code
      );
  }

  if (shipping_address?.name) {
    shipping_address.phone = strapi
      .service("api::customer.customer")
      .formatPhoneNumber(
        shipping_address?.phone ||
          billing_address?.phone ||
          customerEntity?.phone,
        shipping_address.country_code
      );
  }

  const order = {
    name,
    fulfillmentOrders,
    orderId: id.toString(),
    cancelledAt: cancelled_at,
    cancelReason: cancel_reason,
    orderDate: created_at,
    type: "new",
    subtotal: total_line_items_price,
    discountTotal: total_discounts,
    taxTotal: total_tax,
    shippingTotal,
    total: parseFloat(total_outstanding) > 0 ? total_outstanding : total_price,
    outstandingTotal: total_outstanding,
    paymentMode: parseFloat(total_outstanding) > 0 ? "cod" : "prepaid",
    remittance: null,

    billingAddress: billing_address,
    shippingAddress: shipping_address,
    discountCodes: discount_codes,
    taxLines: tax_lines,
    note,
  };

  let orderEntity = {};

  // create order status
  if (fulfillment_status !== null) {
    const tracking = [];
    for (const fulfillment of fulfillments) {
      const {
        tracking_company,
        shipment_status,
        tracking_number,
        updated_at,
        created_at,
        id,
      } = fulfillment;
      const statusData = {
        tracking_company,
        shipment_status,
        tracking_number,
        updated_at,
        created_at,
        orderId: orderEntity.id,
        fulfillmentId: id.toString(),
      };

      const statusResponse = await strapi
        .service("api::order-status.order-status")
        .createStatus(statusData);

      tracking.push(statusResponse);
    }
  }

  return Response.json(res);
}
