import React from "react";
import format from "date-fns/format";
import { RevenueBarChart, RevenueLineChart } from "./_components/chart";
import {
  getHourlyRevenueAnalytics,
  getRevenueAnalytics,
} from "@/actions/analytics/analytic-actions";
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
  let revenue;

  if (difference > 0) {
    revenue = await getRevenueAnalytics(period);
  } else {
    revenue = await getHourlyRevenueAnalytics(period);
  }
  const r = capitalize("_ello workd");
  console.log(r);

  return (
    <>
      {difference > 0 ? (
        <RevenueBarChart data={revenue.data} />
      ) : (
        <RevenueLineChart data={revenue.data} />
      )}
    </>
  );
};

export default OverviewPage;
