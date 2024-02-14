import React from "react";
import { Inbox, ShoppingBag, Tag, Users } from "lucide-react";
import Numeral from "numeral";

import { getSaleAnalytics } from "@/actions/analytics/analytic-actions";

import AnaliticCard from "./_component/analitic-card";
const AnalyticsPage = async ({ searchParams }: { searchParams: any }) => {
  const { period } = searchParams;

  const {
    data: { sale, purchase, product, customer },
  } = await getSaleAnalytics(period);

  return (
    <>
      <div className="col-span-3 md:col-span-1">
        <AnaliticCard
          title="Revenue"
          href="/sales"
          text={Numeral(sale._sum.total || 0).format()}
          subText={sale._count._all || 0}
          icon={
            <span className="ml-auto bg-success p-3 rounded-md">
              <Inbox className="w-5 h-5" />
            </span>
          }
        />
      </div>
      <div className="col-span-3 md:col-span-1">
        <AnaliticCard
          title="Purchase"
          href="/purchase"
          text={Numeral(purchase._sum.total || 0).format()}
          subText={purchase._count._all}
          icon={
            <span className="ml-auto bg-warning p-3 rounded-md">
              <ShoppingBag className="w-5 h-5" />
            </span>
          }
        />
      </div>
      <div className="col-span-3 md:col-span-1">
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
      </div>
      {/* <div className="col-span-2 md:col-span-1">
        <AnaliticCard
          title="New Customers"
          href="/contacts"
          text={Numeral(customer._count._all || 0).format()}
          subText="NA"
          icon={
            <span className="ml-auto bg-red-500 p-3 rounded-md">
              <Users className="w-5 h-5" />
            </span>
          }
        />
      </div> */}
    </>
  );
};

export default AnalyticsPage;
