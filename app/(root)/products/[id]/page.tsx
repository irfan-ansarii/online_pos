import React from "react";
import MobileHeader from "@/components/shared/mobile-header";
import ProductCard from "./components/ProductCard";
import VariantsCard from "./components/VariantsCard";
import Timeline from "./components/Timeline";

const Page = async () => {
  return (
    <>
      <MobileHeader title="Product" showSearch={false} />
      <main className="grow md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ProductCard />
            <VariantsCard />
          </div>
          <Timeline />
        </div>
      </main>
    </>
  );
};

export default Page;
