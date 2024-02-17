import React from "react";
import { RevenueBarChart } from "./_components/chart";
import { getRevenueAnalytics } from "@/actions/analytics/analytic-actions";
import BarPlaceholder from "../_components/bar-placeholder";

const SalePage = async ({ searchParams }: { searchParams: any }) => {
  const { period } = searchParams;
  const [start, end] = period.split(":");

  const date1 = new Date(start).getTime();
  const date2 = new Date(end).getTime();

  const difference = Math.ceil(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  let groupBy = "hour";
  let format = "hh aa";

  if (difference > 0) {
    groupBy = "day";
    format = "dd-MMM";
  } else if (difference > 90) {
    groupBy = "month";
    format = "MMM";
  }

  const { data: report } = (await getRevenueAnalytics(period, groupBy)) as {
    data: [];
  };

  if (!report || report?.length === 0) {
    return <BarPlaceholder />;
  }

  return <RevenueBarChart data={report} formatter={format} />;
};
export default SalePage;
