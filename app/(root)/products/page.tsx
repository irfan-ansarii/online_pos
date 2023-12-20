import product from "@/actions/product";

import { ListFilter, Plus } from "lucide-react";

import MobileHeader from "@/components/shared/mobile-header";

import ProductCard from "./components/ProductCard";

import Header from "./components/Header";
import NewSheet from "./components/NewSheet";

import Navigation from "./components/Navigation";

interface PageProps {
  searchParams: { [key: string]: string };
}
export default async function ProductPage({ searchParams }: PageProps) {
  const module = product();
  const products = await module.get(searchParams);

  return (
    <>
      {/* <MobileHeader title="Products" /> */}
      <main className="grow">
        {/* <Header /> */}
        {products?.data?.map((product: any) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </main>
    </>
  );
}
