import React from "react";
import { Inbox, ShoppingBag, Tag } from "lucide-react";
import Numeral from "numeral";

import {
  getTotalProductAnalytics,
  getTotalPurchaseAnalytics,
  getTotalRevenueAnalytics,
} from "@/actions/analytics/analytic-actions";

import AnaliticCard from "./_component/analitic-card";

const AnalyticsPage = async ({ searchParams }: { searchParams: any }) => {
  const { period } = searchParams;

  const { data: revenue } = await getTotalRevenueAnalytics(period);
  const { data: purchase } = await getTotalPurchaseAnalytics(period);
  const { data: product } = await getTotalProductAnalytics(period);

  return (
    <>
      <AnaliticCard
        title="Revenue"
        href="/sales"
        text={Numeral(revenue._sum.total || 0).format()}
        subText={revenue._count.total || 0}
        icon={
          <span className="ml-auto bg-success p-3 rounded-md">
            <Inbox className="w-5 h-5" />
          </span>
        }
      />
      <AnaliticCard
        title="Purchase"
        href="/purchase"
        text={Numeral(purchase._sum.total || 0).format()}
        subText={purchase._count.total}
        icon={
          <span className="ml-auto bg-warning p-3 rounded-md">
            <ShoppingBag className="w-5 h-5" />
          </span>
        }
      />

      <AnaliticCard
        title="Product Sold"
        href="/products"
        text={Numeral(product._sum.quantity).format()}
        subText={`${Numeral(product._avg.price).format()}`}
        icon={
          <span className="ml-auto bg-info p-3 rounded-md">
            <Tag className="w-5 h-5" />
          </span>
        }
      />
    </>
  );
};

export default AnalyticsPage;
