import React from "react";
import { getPayments } from "@/actions/payments-actions";
import CartForm from "./components/CartForm";

const Page = async () => {
  const { data } = await getPayments();

  const initialValues = {
    id: null,
    lineItems: [],
    taxType: "included",
    subtotal: 0,
    totalTax: 0,
    totalDiscount: 0,
    lineItemsTotal: 0,
    total: 0,
    totalDue: 0,
    taxLines: [],
    createdAt: new Date().toISOString(),
    saleType: "state",
    transactions: data.map((payment) => ({
      id: payment.id,
      name: payment.name,
      label: payment.label,
      amount: "0",
    })),
  };
  return (
    <main className="grow pb-4 px-1 md:p-4  md:mt-[-4.8rem]">
      <CartForm initialValues={initialValues} />
    </main>
  );
};

export default Page;
