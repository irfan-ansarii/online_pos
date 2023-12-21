import { fetchData } from "@/lib/api";
import EmptyBox from "@/components/shared/empty-box";

import { Product } from "@prisma/client";
import ProductCard from "./components/ProductCard";

interface SearchParamsProps {
  [key: string]: string;
}

async function Page({ searchParams }: { searchParams: SearchParamsProps }) {
  const { data, pagination } = await fetchData({
    url: "/products",
    params: searchParams,
  });

  return (
    <>
      {/* pages */}
      {data?.map((product: Product) => (
        <ProductCard product={product} key={product.id} />
      ))}

      {data?.length === 0 && <EmptyBox />}
      {/* loading */}
    </>
  );
}

export default Page;
