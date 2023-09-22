import React from "react";
import SaleCard from "./components/SaleCard";
import Filters from "./components/Filters";
import MobileHeader from "@/components/shared/mobile-header";
const Page = () => {
  return (
    <>
      <MobileHeader title="Sales" />
      <main className="grow">
        <Filters />
        <div className="space-y-2 px-1 py-4 md:p-4">
          <SaleCard />
          <SaleCard />
          <SaleCard />
          <SaleCard />
          <SaleCard />
          <SaleCard />
          <SaleCard />
          <SaleCard />
          <SaleCard />
          <SaleCard />
          <SaleCard />
          <SaleCard />
          <SaleCard />
          <SaleCard />
          <SaleCard />
          <SaleCard />
        </div>
      </main>
    </>
  );
};

export default Page;
