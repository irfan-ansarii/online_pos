"use client";
import React from "react";
import Link from "next/link";
import Numeral from "numeral";
import { format } from "date-fns";
import { Inbox, IndianRupee, Percent, CalendarDays } from "lucide-react";

import { useCustomer } from "@/hooks/useCustomer";
import Loading from "@/components/shared/Loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import MobileHeader from "@/components/shared/mobile-header";
import Profile from "./components/Profile";
import Analytics from "./components/Analytics";
import OrderItem from "./components/OrderItem";

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { data, isLoading } = useCustomer(Number(id));

  const customer = React.useMemo(() => {
    return data?.data?.data;
  }, [data]);

  return (
    <>
      <MobileHeader title={customer?.firstName} showSearch={false} />
      <main className="grow md:p-6">
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Loading key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                <Analytics
                  title="Total orders"
                  value={customer?._count?.total}
                  icon={<Inbox className="w-5 h-5" />}
                  iconClassName="bg-emerald-500/20"
                />
                <Analytics
                  title="Total spent"
                  value={Numeral(customer?._sum?.total).format()}
                  icon={<IndianRupee className="w-5 h-5" />}
                  iconClassName="bg-emerald-500/20"
                />
                <Analytics
                  title="Avarage order value"
                  value={Numeral(customer?._avg?.total).format()}
                  icon={<Percent className="w-5 h-5" />}
                  iconClassName="bg-emerald-500/20"
                />
                <Analytics
                  title="Last visit"
                  value={
                    customer?.orders?.[0]?.createdAt
                      ? format(
                          new Date(customer?.orders?.[0]?.createdAt),
                          "dd MMM, yy"
                        )
                      : ""
                  }
                  icon={<CalendarDays className="w-5 h-5" />}
                  iconClassName="bg-emerald-500/20"
                />
              </div>

              <Card className="pb-4">
                <CardHeader>
                  <CardTitle className="text-base">Recent Purchases</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent className="divide-y py-0">
                  {customer?.orders?.map((order: any) => (
                    <OrderItem key={order.id} order={order} />
                  ))}
                </CardContent>
                <Link
                  href={`/sales?customer=${customer?.id}`}
                  className="text-center block"
                >
                  <Button variant="link">View All</Button>
                </Link>
              </Card>
            </div>

            <Profile customer={customer} />
          </div>
        )}
      </main>
    </>
  );
};

export default Page;
