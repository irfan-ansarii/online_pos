import React from "react";
import format from "date-fns/format";
import { RevenueBarChart } from "./_components/chart";
import { getPurchaseAnalytics } from "@/actions/analytics/analytic-actions";
import { capitalize } from "@/lib/utils";

interface Props {
  name: string;
  _sum: number;
}

const PurchasePage = async ({ searchParams }: { searchParams: any }) => {
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

  const { data: purchase } = await getPurchaseAnalytics(period, groupBy);

  return (
    <>
      <RevenueBarChart data={purchase} formatter={format} group={groupBy} />
    </>
  );
};
export default PurchasePage;
