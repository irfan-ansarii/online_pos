import React from "react";
import { fetchData } from "@/lib/api";
import EmptyBox from "@/components/shared/empty-box";
import ProductsClient from "./components/ProductsClient"; // Correct the import path
import NewSheet from "./components/NewSheet";
import { Product } from "@prisma/client";

interface PageProps {
  [key: string]: string;
}

interface ResponseProps {
  data: Product[];
  pagination: PageProps;
}

async function Page({ searchParams }: { searchParams: PageProps }) {
  const { data, pagination }: ResponseProps = await fetchData("/products", {
    params: searchParams,
  });

  if (data && data.length === 0) {
    return <EmptyBox />;
  }

  return (
    <>
      <ProductsClient initialData={data} />
      <NewSheet />
    </>
  );
}

export default Page;
