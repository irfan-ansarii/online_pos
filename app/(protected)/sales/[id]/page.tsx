import React from "react";
import { getSale } from "@/actions/sale-actions";

import EditForm from "../new/components/CartForm";

const page = async ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const { data } = await getSale(id);

  const initialValues = {
    id: null,
    lineItems: [],
    taxType: data.taxType,
    subtotal: data.subtotal,
    totalTax: data.totalTax,
    totalDiscount: data.totalDiscount,
    lineItemsTotal: data.lineItemsTotal,
    total: data.total,
    totalDue: data.totalDue,
    taxLines: data.taxLines,
    createdAt: new Date(data.createdAt),
    saleType: "state",
    transactions: [],
  };

  return (
    <main className="grow pb-4 px-1 md:p-4  md:mt-[-4.8rem]">
      <EditForm initialValues={initialValues} />
    </main>
  );
};

export default page;
