import React from "react";
import Link from "next/link";

import Numeral from "numeral";
import { format } from "date-fns";
import { getContact } from "@/actions/contact-actions";

import { Inbox, IndianRupee, Percent, CalendarDays } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Profile from "./components/Profile";
import Analytics from "./components/Analytics";
import OrderItem from "./components/OrderItem";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { data }: any = await getContact(id);
  const isSupplier = data.role === "supplier";
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6 order-2 md:order-1">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
            <Analytics
              title={isSupplier ? "Total purchase" : "Total sale"}
              value={Numeral(data?._count?.total).format()}
              icon={<Inbox className="w-5 h-5" />}
              className="bg-success"
            />
            <Analytics
              title={"Amount"}
              value={Numeral(data?._sum?.total).format()}
              icon={<IndianRupee className="w-5 h-5" />}
              className="bg-pink-600"
            />
            <Analytics
              title="Avarage"
              value={Numeral(data?._avg?.total).format()}
              icon={<Percent className="w-5 h-5" />}
              className="bg-violet-600"
            />
            <Analytics
              title={isSupplier ? "Last purchase" : "Last sale"}
              value={
                data?.sales?.[0]?.createdAt
                  ? format(data?.sales?.[0]?.createdAt, "dd MMM, yy")
                  : "-"
              }
              icon={<CalendarDays className="w-5 h-5" />}
              className="bg-blue-600"
            />
          </div>

          <Card className="pb-4">
            <CardHeader>
              <CardTitle className="text-base">
                Recent {isSupplier ? "Purchase" : "Sale"}
              </CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y py-0">
              {data?.sales?.map((sale: any) => (
                <OrderItem
                  key={sale.id}
                  order={sale}
                  href={`/${isSupplier ? "purchase" : "sales"}?search=${
                    sale.title
                  }`}
                />
              ))}
            </CardContent>
            <Link
              href={`/${isSupplier ? `purchase` : "sale"}?search=${data.email}`}
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
