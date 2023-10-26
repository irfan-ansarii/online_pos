import React from "react";
import MobileHeader from "@/components/shared/mobile-header";
import AddCustomerSheet from "./components/AddCustomerSheet";
import Customers from "./components/Customers";
import StickyHeader from "@/components/shared/sticky-header";
import SearchInput from "@/components/shared/search-input";

const Page = async () => {
  return (
    <>
      <MobileHeader title="Customers" />
      <main className="grow">
        <StickyHeader>
          <div className="grid grid-cols-2 items-center">
            <SearchInput />
            <div className="relative flex gap-4 justify-end">
              <AddCustomerSheet />
            </div>
          </div>
        </StickyHeader>
        <div className="md:p-6">
          <div className="grid grid-cols-1 md:gap-2">
            <Customers />
          </div>
        </div>
        <AddCustomerSheet className="md:hidden" />
      </main>
    </>
  );
};

export default Page;
