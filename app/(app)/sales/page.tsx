import React from "react";
import SaleCard from "./components/SaleCard";
import Filters from "./components/Filters";
import MobileHeader from "@/components/shared/mobile-header";
const Page = () => {
  return (
    <>
      <MobileHeader title="Sales" />
      <main className="grow ">
        <Filters />

        <div className="md:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-4">
            {[...Array(18)].map((el, i) => (
              <SaleCard />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
