"use client";
import React from "react";

import StickyHeader from "@/components/shared/sticky-header";
import SearchInput from "@/components/shared/search-input";
import Navigation from "./Navigation";

interface Props {
  action?: React.ReactNode;
  filters?: React.ReactNode;
}

const Header = ({ action, filters }: Props) => {
  return (
    <>
      <StickyHeader className="justify-start">
        <div className="flex gap-4 flex-1 items-center">
          <Navigation />
          {action}
        </div>
      </StickyHeader>
      <StickyHeader>
        <div className="grid grid-cols-2 items-center">
          {filters ? (
            <>
              <SearchInput />
              <div className="relative flex gap-4 justify-start">{filters}</div>
            </>
          ) : (
            <div className="col-span-2">
              <SearchInput />
            </div>
          )}
        </div>
      </StickyHeader>
    </>
  );
};

export default Header;
