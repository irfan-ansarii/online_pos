"use client";
import React from "react";
import SingleHeader from "@/components/shared/single-header";
import MobileHeader from "@/components/shared/mobile-header";

import Profile from "./components/Profile";
import Analytics from "./components/Analytics";
import Orders from "./components/Orders";
import { useUser } from "@/hooks/useUser";
const Page = ({ params }: any) => {
  const { data: user, isLoading } = useUser(params.id);
  console.log(user);
  return (
    <>
      <MobileHeader title="user" showSearch={false} />
      <main className="grow md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <Analytics />
            <Orders />
          </div>
          <Profile />
        </div>
      </main>
    </>
  );
};

export default Page;
