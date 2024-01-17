import React from "react";
import Link from "next/link";
import { Tv2 } from "lucide-react";

import { getSession } from "@/actions/auth-actions";
import { getLocations } from "@/actions/store-actions";

import Profile from "@/components/global/header/profile";
import Activity from "@/components/global/header/activity";
import Setting from "@/components/global/header/setting";
import { buttonVariants } from "@/components/ui/button";

import Stores from "@/components/global/header/stores";
import CreateStore from "@/components/global/header/create-store";
import PageTitle from "@/components/global/header/page-title";

const Header = async () => {
  const { data } = await getSession();
  const { data: locations } = await getLocations();

  return (
    <div className="sticky top-0 z-50 shadow w-full border-b bg-background/95 backdrop-blur">
      <header className="h-[60px] px-4 md:px-6">
        <div className="flex h-full w-full items-center justify-between">
          <div className="flex gap-4 flex-1 items-center">
            <PageTitle />
            {/* stores dropdown */}
            <div className="hidden md:flex">
              <Stores locations={locations} session={data} />
            </div>
            {/* pos link */}
            <Link
              className={`${buttonVariants({
                variant: "secondary",
              })} hidden md:flex`}
              href="/sales/new"
            >
              <Tv2 className="w-4 h-4 mr-2" /> POS
            </Link>

            {/* create store dialog */}
            <CreateStore />
          </div>
          <div className="justify-self-end flex gap-3">
            <Setting />

            <Activity />
            <Profile session={data} />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
