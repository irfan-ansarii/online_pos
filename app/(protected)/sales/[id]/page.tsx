import React from "react";
import { getSale } from "@/actions/sale-actions";

import EditForm from "./components/CartForm";
import { getPayments } from "@/actions/payments-actions";

const page = async ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const { data } = await getSale(id);
  const { data: transactions } = await getPayments();
  const initialValues = {
    id: data.id,
    customerId: data.customerId,
    employeeId: data.employeeId,
    lineItems: data.lineItems.map((item) => ({
      title: item.title,
      variantTitle: item.variantTitle,
      sku: item.sku,
      barcode: item.barcode,
      price: Number(item.price),
      taxRate: Number(item.taxRate),
      quantity: Number(item.quantity),
      totalDiscount: Number(item.totalDiscount),
      totalTax: Number(item.totalTax),
      total: Number(item.total),
      taxLines: item.taxLines,
      productId: item.productId,
      variantId: item.variantId,
      itemId: item.id,
      stock: 0,
      imageSrc: item.product?.image?.src,
    })),
    taxType: data.taxType,
    subtotal: data.subtotal,
    totalTax: data.totalTax,
    totalDiscount: data.totalDiscount,
    lineItemsTotal: data.lineItemsTotal,
    total: data.total,
    totalDue: data.totalDue,
    totalPaid: Math.abs(data.total) - Math.abs(data.totalDue),
    totalInvoice: Math.abs(data.total) + Number(0) - 11503.6,
    // Math.abs(total) + Number(received.refund) - received.sale
    taxLines: data.taxLines,
    createdAt: new Date(data.createdAt),
    saleType: "state",
    transactions: transactions.map((payment) => ({
      id: payment.id,
      name: payment.name,
      label: payment.label,
      amount: "0",
    })),
  };
  console.log(data, Math.abs(data.total) + Number(0) - 11503);
  return (
    <main className="grow pb-4 px-1 md:p-4  md:mt-[-4.8rem]">
      <EditForm initialValues={initialValues} />
    </main>
  );
};

export default page;
