"use client";
import React from "react";
import Profile from "@/components/global/header/profile";

import Activity from "@/components/global/header/activity";
import Setting from "@/components/global/header/setting";

const Header = () => {
  return (
    <header className="h-[60px] border-b shadow px-4">
      <div className="flex h-full w-full items-center justify-between">
        <div className="text-md font-bold text-primary">Logo</div>
        <div className="justify-self-end flex gap-3">
          <Setting />
          <Activity />
          <Profile />
        </div>
      </div>
    </header>
  );
};

export default Header;
