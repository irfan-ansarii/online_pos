import React from "react";
import Profile from "@/components/global/header/profile";
import Activity from "@/components/global/header/activity";
import Setting from "@/components/global/header/setting";
import LocationDialog from "@/components/global/header/location-dialog";
import CreateLocation from "./location-create";

const Header = () => {
  return (
    <div className="hidden md:block sticky top-0 z-50 shadow w-full border-b bg-background/95 backdrop-blur">
      <header className="h-[60px] px-4">
        <div className="flex h-full w-full items-center justify-between">
          <div className="flex gap-4 flex-1">
            <LocationDialog />
            <CreateLocation />
          </div>
          <div className="justify-self-end flex gap-3">
            <Setting />

            <Activity />
            <Profile />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
