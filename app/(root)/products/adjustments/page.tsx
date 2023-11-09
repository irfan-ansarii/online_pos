import React from "react";
import MobileHeader from "@/components/shared/mobile-header";
import { Button } from "@/components/ui/button";

import Header from "../components/Header";
import Navigation from "../components/Navigation";

const Page = () => {
  return (
    <>
      <MobileHeader title="Products" />
      <main className="grow">
        <Header
          action={<Button className="ml-auto">New</Button>}
          filters={<div>Filters</div>}
        />

        {/* mobile navigation */}
        <div className="h-[60px] px-4 overflow-x-auto">
          <Navigation />
        </div>
        <div className="md:p-6">
          <div className="grid grid-cols-1 md:gap-2 items-center">
            {/* <Products /> */}
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
