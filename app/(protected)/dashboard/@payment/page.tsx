import React from "react";
import Chart from "./_components/chart";
import { getPaymentAnalytics } from "@/actions/analytics/analytic-actions";

const PaymentOverviewPage = async ({ searchParams }: { searchParams: any }) => {
  const { period } = searchParams;

  const { data: payments } = await getPaymentAnalytics(period);

  const data = payments.map((p) => ({
    name: p.name,
    value: p._sum.amount,
  }));

  return <Chart data={data} />;
};

export default PaymentOverviewPage;
