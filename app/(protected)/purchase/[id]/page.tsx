import React from "react";
import { getPurchase } from "@/actions/purchase-actions";

import EditForm from "./components/CartForm";
import { getPayments } from "@/actions/payments-actions";

const page = async ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const { data } = await getPurchase(id);
  const { data: transactions } = await getPayments({ type: "purchase" });

  const { purchase, refund } = data.transactions.reduce(
    (acc, curr) => {
      if (curr.kind === "refund") {
        acc.refund += Number(curr.amount);
      } else {
        acc.purchase += Number(curr.amount);
      }
      return acc;
    },
    {
      purchase: 0,
      refund: 0,
    }
  );

  const initialValues = {
    id: data.id,
    title: data.title,
    supplierId: data.supplierId,
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
    purchaseType: data.purchaseType,
    taxType: data.taxType,
    subtotal: data.subtotal,
    totalTax: data.totalTax,
    totalDiscount: data.totalDiscount,
    total: data.total,
    totalDue: data.totalDue,
    invoiceTotal: data.invoiceTotal,
    totalPaid: purchase,
    totalRefund: refund,
    transactionKind:
      data.total + Number(refund) - purchase < 0 ? "refund" : "purchase",
    taxLines: data.taxLines,
    createdAt: new Date(data.createdAt),
    transactions: transactions.map((payment) => ({
      id: payment.id,
      name: payment.name,
      label: payment.label,
      refrenceNumber: "",
      amount: "0",
    })),
  };

  return (
    <main className="grow pb-4 px-1 md:p-4  md:mt-[-4.8rem]">
      <EditForm initialValues={initialValues} />
    </main>
  );
};

export default page;
