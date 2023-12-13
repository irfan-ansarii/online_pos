"use client";
import React from "react";
import SingleHeader from "@/components/shared/single-header";
import MobileHeader from "@/components/shared/mobile-header";

import Profile from "./components/Profile";
import Analytics from "./components/Analytics";
import Orders from "./components/Orders";

import { useCustomer } from "@/hooks/useCustomer";
import { Inbox } from "lucide-react";
const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { data, isLoading } = useCustomer(Number(id));

  const customer = React.useMemo(() => {
    return data?.data?.data;
  }, [data]);
  console.log(customer);
  return (
    <>
      <MobileHeader title="Customer" showSearch={false} />
      <main className="grow md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
              <Analytics
                title="Total Spent"
                value={578}
                icon={<Inbox className="w-5 h-5" />}
                iconClassName="bg-emerald-500/20"
              />
              <Analytics
                title="Total Spent"
                value={578}
                icon={<Inbox className="w-5 h-5" />}
                iconClassName="bg-emerald-500/20"
              />
              <Analytics
                title="Total Spent"
                value={578}
                icon={<Inbox className="w-5 h-5" />}
                iconClassName="bg-emerald-500/20"
              />
              <Analytics
                title="Total Spent"
                value={578}
                icon={<Inbox className="w-5 h-5" />}
                iconClassName="bg-emerald-500/20"
              />
            </div>

            <Orders />
          </div>
          <Profile />
        </div>
      </main>
    </>
  );
};

export default Page;
