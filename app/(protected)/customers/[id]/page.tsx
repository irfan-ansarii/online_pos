import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Numeral from "numeral";
import { format } from "date-fns";
import { getCustomer } from "@/actions/customer-actions";

import { Inbox, IndianRupee, Percent, CalendarDays } from "lucide-react";

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

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { data } = await getCustomer(id);

  if (!data) {
    return notFound();
  }

  return (
    <>
      <MobileHeader title={data?.firstName} showSearch={false} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 order-2 md:order-1">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
            <Analytics
              title="Total orders"
              value={data?._count?.total || "0.00"}
              icon={<Inbox className="w-5 h-5" />}
              iconClassName="bg-emerald-500/20"
            />
            <Analytics
              title="Total spent"
              value={Numeral(data?._sum?.total).format()}
              icon={<IndianRupee className="w-5 h-5" />}
              iconClassName="bg-emerald-500/20"
            />
            <Analytics
              title="Avarage order value"
              value={Numeral(data?._avg?.total).format()}
              icon={<Percent className="w-5 h-5" />}
              iconClassName="bg-emerald-500/20"
            />
            <Analytics
              title="Last visit"
              value={
                data?.orders?.[0]?.createdAt
                  ? format(data?.orders?.[0]?.createdAt, "dd MMM, yy")
                  : ""
              }
              icon={<CalendarDays className="w-5 h-5" />}
              iconClassName="bg-emerald-500/20"
            />
          </div>

          <Card className="pb-4">
            <CardHeader>
              <CardTitle className="text-base">Recent Purchases</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y py-0">
              {data?.sales?.map((sale: any) => (
                <OrderItem key={sale.id} order={sale} />
              ))}
            </CardContent>
            <Link
              href={`/sales?customer=${data?.id}`}
              className="text-center block"
            >
              <Button variant="link">View All</Button>
            </Link>
          </Card>
        </div>

        <Profile customer={data} />
      </div>
    </>
  );
};

export default Page;
