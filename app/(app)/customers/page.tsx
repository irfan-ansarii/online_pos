import React from "react";
import MobileHeader from "@/components/shared/mobile-header";
import CustomerCard from "./components/CustomerCard";
import PageHeader from "./components/PageHeader";
import AddCustomerSheet from "./components/AddCustomerSheet";
import Loading from "../users/componets/Loading";
const Page = () => {
  return (
    <>
      <MobileHeader title="Customers" />
      <main className="grow">
        <PageHeader />
        <div className="md:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-4">
            {[...Array(4)].map(() => (
              <CustomerCard />
            ))}
            {[...Array(4)].map(() => (
              <Loading />
            ))}
          </div>
        </div>
        <AddCustomerSheet className="md:hidden" />
      </main>
    </>
  );
};

export default Page;
