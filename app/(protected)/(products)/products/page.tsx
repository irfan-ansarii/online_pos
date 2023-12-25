import React from "react";
import { Product } from "@prisma/client";
import { getProducts } from "@/actions/product-actions";

import EmptyBox from "@/components/shared/empty-box";

import Pagination from "@/components/shared/pagination";
import ProductCard from "./components/ProductCard";
interface PageProps {
  [key: string]: string;
}

interface ResponseProps {
  data: Product[];
  pagination: { page: number; pageCount: number };
}

async function Page({ searchParams }: { searchParams: PageProps }) {
  const { data, pagination }: ResponseProps = await getProducts(searchParams);

  if (!data || data.length === 0) {
    return <EmptyBox />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:gap-2 items-center">
        {data.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>

      <div className="flex items-center justify-center mt-auto">
        <Pagination className="mt-6" pagination={pagination} />
      </div>
    </>
  );
}

export default Page;
