"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useProduct } from "@/hooks/useProduct";

import MobileHeader from "@/components/shared/mobile-header";
import Loading from "../components/Loading";
import ErrorBox from "@/components/shared/error-box";
import ProductCard from "./components/ProductCard";
import VariantsCard from "./components/VariantsCard";
import StickyHeader from "@/components/shared/sticky-header";
import { Button } from "@/components/ui/button";

const Page = ({ params }: { params: { id: number } }) => {
  const { data: product, isLoading, isError, error } = useProduct(params.id);

  return (
    <>
      <MobileHeader title="Product" showSearch={false} />
      <StickyHeader>
        <div className="grid grid-cols-2 items-center">
          <div>
            <Button variant="ghost">
              <ArrowLeft className="w-5 h-5 mr-1" /> {product?.data?.data.title}
            </Button>
          </div>
          <div>
            <div className="rounded-md overflow-hidden inline-flex divide-x-2 ml-auto">
              <Button variant="secondary" className="rounded-none bg-accent">
                button group 1
              </Button>
              <Button variant="secondary" className="rounded-none bg-accent">
                button group 2
              </Button>
              <Button variant="secondary" className="rounded-none bg-accent">
                button group 3
              </Button>
            </div>
          </div>
        </div>
      </StickyHeader>
      <main className="grow md:p-6">
        <div className="grid grid-cols-3 md:gap-2">
          {isLoading && [...Array(4)].map((_, i) => <Loading key={i} />)}

          {!isLoading && !isError && (
            <div className="col-span-2">
              <ProductCard product={product?.data?.data} />
              <VariantsCard product={product?.data?.data} />
            </div>
          )}
          <div>ghg</div>
          {isError && <ErrorBox title={error?.response?.data?.message} />}
        </div>
      </main>
    </>
  );
};

export default Page;
