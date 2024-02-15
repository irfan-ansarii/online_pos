import React from "react";
import Link from "next/link";
import {
  getBestSellersAnalytics,
  getProductSoldAnalytics,
} from "@/actions/analytics/analytic-actions";

import { Badge } from "@/components/ui/badge";
import ProgressChart from "./_components/chart";
import EmptyBox from "@/components/shared/empty-box";

const OverviewPage = async ({ searchParams }: { searchParams: any }) => {
  const { period } = searchParams;

  const { data } = await getBestSellersAnalytics(period);
  const { data: product } = await getProductSoldAnalytics(period);

  const total = product._sum.quantity || 0;

  return (
    <div className="divide-y">
      {data && data.length > 0 ? (
        data.map((item) => (
          <div
            key={item.variantId}
            className="flex gap-4 items-center py-1.5 first:pt-0 last:pb-0 "
          >
            <div className="space-y-0.5">
              <Link
                href={`/products?search=${item.barcode}`}
                className="hover:underline block font-semibold"
              >
                {item.title}
              </Link>
              {item.variantTitle !== "Default" && (
                <Badge variant="secondary" className="py-0 mr-1">
                  {item.variantTitle}
                </Badge>
              )}

              <Badge variant="secondary" className="py-0">
                {item.barcode}
              </Badge>
            </div>

            <div className="ml-auto">{item._sum.quantity}</div>
            {/* progress */}
            <div className="w-10 h-10 relative">
              <ProgressChart percent={(item._sum.quantity! / total) * 100} />
              <span className="absolute inset-x-0 top-0 inset-y-0 text-[10px] text-muted-foreground font-semibold flex items-center justify-center">
                {Math.round((item._sum.quantity! / total) * 100)}%
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

export default OverviewPage;
