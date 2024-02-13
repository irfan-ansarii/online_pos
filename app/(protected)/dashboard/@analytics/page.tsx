import React from "react";
import { Inbox, ShoppingBag, Tag, Users } from "lucide-react";
import Numeral from "numeral";

import {
  getSaleAnalytics,
  getPurchaseAnalytics,
  getCustomersAnalytics,
  getInventoryAnalytics,
} from "@/actions/analytics/analytic-actions";

import AnaliticCard from "./_component/analitic-card";
const AnalyticsPage = async ({ searchParams }: { searchParams: any }) => {
  const { period } = searchParams;
  const { data: sale } = await getSaleAnalytics(period);
  const { data: purchase } = await getPurchaseAnalytics(period);
  const { data: s } = await getInventoryAnalytics(period);
  const { data: customer } = await getCustomersAnalytics(period);
  return (
    <>
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <AnaliticCard
          title="Sale"
          href="/sales"
          text={Numeral(sale._sum.total || 0).format()}
          subText={sale._count._all || 0}
          icon={
            <span className="ml-auto bg-red-500 p-3 rounded-full">
              <Inbox className="w-4 h-4" />
            </span>
          }
        />
      </div>
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <AnaliticCard
          title="Purchase"
          href="/purchase"
          text={Numeral(purchase._sum.total || 0).format()}
          subText={purchase._count._all || 0}
          icon={
            <span className="ml-auto bg-red-500 p-3 rounded-full">
              <ShoppingBag className="w-4 h-4" />
            </span>
          }
        />
      </div>
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <AnaliticCard
          title="Product Sold"
          href="/products"
          text="200"
          subText={Numeral(209020 || 0).format()}
          icon={
            <span className="ml-auto bg-red-500 p-3 rounded-full">
              <Tag className="w-4 h-4" />
            </span>
          }
        />
      </div>
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <AnaliticCard
          title="New Customers"
          href="/contacts"
          text={customer._count._all || 0}
          subText="NA"
          icon={
            <span className="ml-auto bg-red-500 p-3 rounded-full">
              <Users className="w-4 h-4" />
            </span>
          }
        />
      </div>
    </>
  );
};

export default AnalyticsPage;
