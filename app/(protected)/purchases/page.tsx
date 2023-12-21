import React from "react";
import PurchaseCard from "./components/PurchaseCard";
import Filters from "./components/Filters";
import MobileHeader from "@/components/shared/mobile-header";
import Loading from "./components/Loading";
const Page = () => {
  return (
    <>
      <MobileHeader title="Purchases" />
      <main className="grow ">
        <Filters />

        <div className="md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-6">
            {[...Array(2)].map((el, i) => (
              <PurchaseCard />
            ))}
            {[...Array(6)].map((_, i) => (
              <Loading />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
