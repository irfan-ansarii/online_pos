"use client";
import React from "react";
import ProductCard from "./ProductCard";
import Loading from "./Loading";
import { useProducts } from "@/hooks/useProduct";
import EmptyBox from "@/components/shared/empty-box";
import ErrorBox from "@/components/shared/error-box";
const Products = () => {
  const { data: products, isLoading, isError, error } = useProducts({});

  return (
    <>
      {/* loading */}

      {isLoading && [...Array(6)].map((_, i) => <Loading key={i} />)}

      {/* pages */}

      {products?.pages.map((page) =>
        page.data.data.length === 0 ? (
          <EmptyBox
            className="col-span-1 md:col-span-2 xl:col-span-3"
            title="No Users Found"
          />
        ) : (
          <div className="rounded-md border divide-y">
            {page.data.data.map((product: any) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        )
      )}

      {/* error */}
      {isError && (
        <ErrorBox
          className="col-span-1 md:col-span-2 xl:col-span-3"
          title={error?.response?.data?.message}
        />
      )}
    </>
  );
};

export default Products;
