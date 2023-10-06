import React from "react";
import MobileHeader from "@/components/shared/mobile-header";
import Users from "./componets/Users";
import StickyHeader from "@/components/shared/sticky-header";
import SearchInput from "@/components/shared/search-input";
import AddUserDialog from "./componets/AddUserDialog";

const Page = () => {
  return (
    <>
      <MobileHeader title="Users" />
      <main className="grow">
        <StickyHeader>
          <div className="grid grid-cols-2 items-center">
            <SearchInput />
            <div className="relative flex gap-4 justify-end">
              <AddUserDialog />
            </div>
          </div>
        </StickyHeader>

        <div className="md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-6">
            <Users />
          </div>
        </div>
        <AddUserDialog className="md:hidden" />
      </main>
    </>
  );
};

export default Page;
