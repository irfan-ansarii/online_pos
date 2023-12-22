import React from "react";
import { Product } from "@prisma/client";
import { fetchData } from "@/lib/actions";

import EmptyBox from "@/components/shared/empty-box";

import Pagination from "@/components/shared/pagination";
import ProductCard from "./components/ProductCard";
import { getheader } from "@/lib/decode-jwt";
interface PageProps {
  [key: string]: string;
}

interface ResponseProps {
  data: Product[];
  pagination: { page: number; pageCount: number };
}

async function Page({ searchParams }: { searchParams: PageProps }) {
  const t = await getheader();
  console.log("get header in product page ", t);
  const { data, pagination }: ResponseProps = await fetchData({
    endpoint: "/products",
    params: searchParams,
  });

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

      <div className="flex items-center justify-center mt-6">
        <Pagination className="mt-6" pagination={pagination} />
      </div>
    </>
  );
}

export default Page;
