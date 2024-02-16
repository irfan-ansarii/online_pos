import React from "react";
import format from "date-fns/format";
import { RevenueBarChart, RevenueLineChart } from "./_components/chart";
import { getRevenueAnalytics } from "@/actions/analytics/analytic-actions";
import { capitalize } from "@/lib/utils";

interface Props {
  name: string;
  _sum: number;
}
const OverviewPage = async ({ searchParams }: { searchParams: any }) => {
  const { period } = searchParams;
  const [start, end] = period.split(":");

  const date1 = new Date(start).getTime();
  const date2 = new Date(end).getTime();

  const difference = Math.ceil(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  let groupBy = "hour";

  if (difference > 0) {
    groupBy = "day";
  } else if (difference > 90) {
    groupBy = "month";
  }

  const { data: revenue } = await getRevenueAnalytics(period, groupBy);

  return (
    <>
      {difference > 0 ? (
        <RevenueBarChart data={revenue} />
      ) : (
        <RevenueLineChart data={revenue} />
      )}
    </>
  );
};

export default OverviewPage;
