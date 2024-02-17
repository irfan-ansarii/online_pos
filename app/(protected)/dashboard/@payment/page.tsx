import React from "react";
import Chart from "./_components/chart";
import { getPaymentAnalytics } from "@/actions/analytics/analytic-actions";
import PiePlaceholder from "../_components/pie-placeholder";

const PaymentOverviewPage = async ({ searchParams }: { searchParams: any }) => {
  const { period } = searchParams;

  const { data: payments } = await getPaymentAnalytics(period);

  const data = payments.map((p) => ({
    name: p.name,
    value: p._sum.amount,
  }));

  if (!data || data.length === 0) {
    return <PiePlaceholder />;
  }
  return <Chart data={data} />;
};

export default PaymentOverviewPage;
