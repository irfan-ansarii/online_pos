"use client";
import React from "react";
import { useProduct } from "@/hooks/useProduct";

import MobileHeader from "@/components/shared/mobile-header";
import Loading from "../components/Loading";
import ErrorBox from "@/components/shared/error-box";
import ProductCard from "./components/ProductCard";
import VariantsCard from "./components/VariantsCard";

const Page = ({ params }: { params: { id: number } }) => {
  const { data: product, isLoading, isError, error } = useProduct(params.id);

  return (
    <>
      <MobileHeader title="Product" showSearch={false} />
      <main className="grow md:p-6">
        <div className="grid grid-cols-1 md:gap-2">
          {isLoading && [...Array(4)].map((_, i) => <Loading key={i} />)}
          {!isLoading && !isError && (
            <>
              <ProductCard product={product?.data?.data} />
              <VariantsCard product={product?.data?.data} />
            </>
          )}

          {isError && <ErrorBox title={error?.response?.data?.message} />}
        </div>
      </main>
    </>
  );
};

export default Page;
