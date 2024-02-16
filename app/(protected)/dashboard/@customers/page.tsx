import React from "react";
import Link from "next/link";
import Numeral from "numeral";
import {
  getTotalRevenueAnalytics,
  getUserAnalytics,
} from "@/actions/analytics/analytic-actions";
import ProgressChart from "../@bestSellers/_components/chart";
import EmptyBox from "@/components/shared/empty-box";
const RevenueOverTime = async ({ searchParams }: { searchParams: any }) => {
  const { period } = searchParams;

  const { data } = await getUserAnalytics(period, "customerId");
  const { data: sale } = await getTotalRevenueAnalytics(period);

  const total = sale._sum.total || 0;

  return (
    <div className="divide-y">
      {data && data.length > 0 ? (
        data?.map((item) => (
          <div
            key={item.customerId}
            className="flex gap-4 items-center py-1.5 first:pt-0 last:pb-0 "
          >
            <div className="space-y-0.5">
              <Link
                href={`/contacts/${item?.customerId}`}
                className="hover:underline block font-semibold"
              >
                {item?.name}
              </Link>

              <div className="py-0 mr-1 text-muted-foreground">
                {item.phone}
              </div>
            </div>

            <div className="ml-auto">{Numeral(item._sum.total).format()}</div>
            {/* progress */}
            <div className="w-10 h-10 relative">
              <ProgressChart percent={(item._sum.total! / total) * 100} />
              <span className="absolute inset-x-0 top-0 inset-y-0 text-[10px] text-muted-foreground font-semibold flex items-center justify-center">
                {Math.round((item._sum.total! / total) * 100)}%
              </span>
            </div>
          </div>
        ))
      ) : (
        <EmptyBox className="h-[300px]" />
      )}
    </div>
  );
};

export default RevenueOverTime;
