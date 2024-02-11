import React from "react";
import { getSale } from "@/actions/sale-actions";

import EditForm from "./components/CartForm";
import { getPayments } from "@/actions/payments-actions";

const page = async ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const { data } = await getSale(id);
  const { data: transactions } = await getPayments();

  const { sale, refund } = data.transactions.reduce(
    (acc, curr) => {
      if (curr.kind === "refund") {
        acc.refund += Number(curr.amount);
      } else {
        acc.sale += Number(curr.amount);
      }
      return acc;
    },
    {
      sale: 0,
      refund: 0,
    }
  );

  const initialValues = {
    id: data.id,
    customerId: data.customerId,
    billingAddress: data.billingAddress,
    shippingAddress: data.shippingAddress,
    employeeId: data.employeeId,
    lineItems: data.lineItems.map((item) => ({
      itemId: item.id,
      kind: item.kind,
      originalQuantity: Number(item.quantity),
      originalKind: item.kind,
      productId: item.productId,
      variantId: item.variantId,
      title: item.title,
      variantTitle: item.variantTitle,
      sku: item.sku,
      hsn: item.hsn,
      barcode: item.barcode,
      price: Number(item.price),
      taxRate: Number(item.taxRate),
      quantity: Number(item.quantity),
      totalDiscount: Number(item.totalDiscount),
      totalTax: Number(item.totalTax),
      total: Number(item.total),
      taxLines: item.taxLines,
      stock: 0,
      imageSrc: item.product?.image?.src,
    })),
    saleType: data.saleType,
    taxType: data.taxType,
    subtotal: data.subtotal,
    totalTax: data.totalTax,
    totalDiscount: data.totalDiscount,
    total: data.total,
    totalDue: data.totalDue,
    invoiceTotal: data.invoiceTotal,
    totalPaid: sale,
    totalRefund: refund,
    transactionKind: data.total + Number(refund) - sale < 0 ? "refund" : "sale",
    taxLines: data.taxLines,
    createdAt: new Date(data.createdAt),

    transactions: transactions.map((payment) => ({
      id: payment.id,
      name: payment.name,
      label: payment.label,
      amount: "0",
    })),
  };

  return (
    <div className="grow pb-4 px-1 md:p-4  md:mt-[-4.8rem]">
      <EditForm initialValues={initialValues} />
    </div>
  );
};

export default page;