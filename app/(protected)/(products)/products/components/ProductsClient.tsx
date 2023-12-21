import React from "react";
import { Product } from "@prisma/client";
import ProductCard from "./ProductCard";

const ProductsClient = ({ initialData }: { initialData: Product[] }) => {
  return (
    <>
      {initialData.map((product) => (
        <ProductCard product={product} />
      ))}
      ProductsClient
    </>
  );
};

export default ProductsClient;
