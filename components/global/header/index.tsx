"use client";
import React from "react";
import { JwtPayload } from "jsonwebtoken";
import Profile from "@/components/global/header/profile";
import Activity from "@/components/global/header/activity";
import Setting from "@/components/global/header/setting";
import Stores from "@/components/global/header/stores";
import CreateStore from "./create-store";

const Header = ({ session }: { session: JwtPayload }) => {
  return (
    <div className="hidden md:block sticky top-0 z-50 shadow w-full border-b bg-background/95 backdrop-blur">
      <header className="h-[60px] px-4">
        <div className="flex h-full w-full items-center justify-between">
          <div className="flex gap-4 flex-1">
            <Stores />
            <CreateStore />
          </div>
          <div className="justify-self-end flex gap-3">
            <Setting />

            <Activity />
            <Profile session={session} />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
