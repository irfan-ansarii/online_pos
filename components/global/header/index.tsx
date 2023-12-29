import React from "react";

import { getSession } from "@/actions/auth-actions";

import Profile from "@/components/global/header/profile";
import Activity from "@/components/global/header/activity";
import Setting from "@/components/global/header/setting";
import Stores from "@/components/global/header/stores";
import CreateStore from "./create-store";
import { getLocations } from "@/actions/store-actions";

const Header = async () => {
  const { data } = await getSession();
  const { data: locations } = await getLocations();

  return (
    <div className="hidden md:block sticky top-0 z-50 shadow w-full border-b bg-background/95 backdrop-blur">
      <header className="h-[60px] px-4">
        <div className="flex h-full w-full items-center justify-between">
          <div className="flex gap-4 flex-1">
            <Stores locations={locations} session={data} />
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
