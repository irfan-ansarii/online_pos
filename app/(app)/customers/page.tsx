import React from "react";
import MobileHeader from "@/components/shared/mobile-header";
import CustomerCard from "./components/CustomerCard";
import Filters from "../sales/components/Filters";
const Page = () => {
  return (
    <>
      <MobileHeader title="Customers" />
      <main className="grow">
        <Filters />
        <div className="px-1 py-4 md:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(18)].map(() => (
              <CustomerCard />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
