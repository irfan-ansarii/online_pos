"use client";
import React from "react";
import { Product } from "@prisma/client";
import ProductCard from "./ProductCard";
import { useQueryParams } from "@/hooks/useQueryParams";
const ProductsClient = ({ initialData }: { initialData: Product[] }) => {
  const { queryParams, setQueryParams } = useQueryParams();
  return (
    <>
      <div className="grid grid-cols-1 md:gap-2 items-center">
        {initialData.map((product) => (
          <ProductCard product={product} />
        ))}
      </div>

      <div onClick={() => setQueryParams({ page: 2 })}>Next</div>
    </>
  );
};

export default ProductsClient;
