import React from "react";
import MobileHeader from "@/components/shared/mobile-header";
import CustomerCard from "./components/CustomerCard";
import PageHeader from "./components/PageHeader";
import AddCustomerSheet from "./components/AddCustomerSheet";
const Page = () => {
  return (
    <>
      <MobileHeader title="Customers" />
      <main className="grow">
        <PageHeader />
        <div className="md:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-4">
            {[...Array(18)].map(() => (
              <CustomerCard />
            ))}
          </div>
        </div>
        <AddCustomerSheet className="md:hidden" />
      </main>
    </>
  );
};

export default Page;
