import React from "react";
import Chart from "./_components/chart";
import { getExpenseAnalytics } from "@/actions/analytics/analytic-actions";
import PiePlaceholder from "../_components/pie-placeholder";

const PaymentOverviewPage = async ({ searchParams }: { searchParams: any }) => {
  const { period } = searchParams;

  const { data: expenses } = await getExpenseAnalytics(period);

  const data = expenses.map((p) => ({
    name: p.category,
    value: p._sum.amount,
  }));

  if (!data || data.length === 0) {
    return <PiePlaceholder />;
  }
  return <Chart data={data} />;
};

export default PaymentOverviewPage;
