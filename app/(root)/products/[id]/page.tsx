"use client";
import React from "react";
import MobileHeader from "@/components/shared/mobile-header";
import ProductCard from "./components/ProductCard";
import VariantsCard from "./components/VariantsCard";
import Timeline from "./components/StockCard";
import { useProduct } from "@/hooks/useProduct";

const Page = async ({ params }) => {
  const { data: product, isLoading, isError } = useProduct(params.id);
  console.log(product);
  return (
    <>
      <MobileHeader title="Product" showSearch={false} />
      <main className="grow md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {!isLoading && <ProductCard product={product?.data?.data} />}
            <VariantsCard product={product} />
          </div>
          <Timeline />
        </div>
      </main>
    </>
  );
};

export default Page;
