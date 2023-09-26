"use client";
import React from "react";
import StickyHeader from "@/components/shared/sticky-header";
import SearchInput from "@/components/shared/search-input";
import AddCustomerSheet from "./AddCustomerSheet";
const PageHeader = () => {
  return (
    <StickyHeader>
      <div className="grid grid-cols-2 items-center">
        <SearchInput />
        <div className="relative flex gap-4 justify-end">
          <AddCustomerSheet />
        </div>
      </div>
    </StickyHeader>
  );
};

export default PageHeader;