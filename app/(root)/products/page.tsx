"use client";
import { Plus, PlusCircle } from "lucide-react";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useProducts } from "@/hooks/useProduct";
import { useIntersectionObserver } from "@uidotdev/usehooks";

import MobileHeader from "@/components/shared/mobile-header";

import { Button } from "@/components/ui/button";

import EmptyBox from "@/components/shared/empty-box";
import ErrorBox from "@/components/shared/error-box";

import ProductCard from "./components/ProductCard";
import Loading from "./components/Loading";

import Header from "./components/Header";
import NewSheet from "./components/NewSheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Navigation from "./components/Navigation";

const Page = () => {
  const { queryParams } = useQueryParams();

  const {
    data: products,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    fetchNextPage,
  } = useProducts(queryParams);

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  });
  return (
    <>
      <MobileHeader title="Products" />
      <main className="grow">
        <Header
          action={
            <NewSheet>
              <Button className="ml-auto">
                <Plus className="w-5 h-5 mr-2" />
                New
              </Button>
            </NewSheet>
          }
          filters={
            <Button className="ml-auto border-dashed text-sm" variant="outline">
              <PlusCircle className="w-4 h-4 mr-2" />
              Status
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm">
                Active
              </Badge>
            </Button>
          }
        />

        {/* mobile navigation */}
        <div className="h-[60px] px-4 overflow-x-auto">
          <Navigation />
        </div>
        {/* page content */}
        <div className="md:p-6">
          <div className="grid grid-cols-1 md:gap-2 items-center">
            {/* pages */}

            {products?.pages.map((page) =>
              page.data.data.length === 0 ? (
                <EmptyBox
                  className="col-span-1 md:col-span-2 xl:col-span-3"
                  title="No Products Found"
                />
              ) : (
                page.data.data.map((product: any) => (
                  <ProductCard product={product} key={product.id} />
                ))
              )
            )}

            {/* error */}
            {isError && (
              <ErrorBox
                className="col-span-1 md:col-span-2 xl:col-span-3"
                title={error?.response?.data?.message}
              />
            )}

            {/* loading */}
            {(isLoading || isFetchingNextPage) &&
              [...Array(6)].map((_, i) => <Loading key={i} />)}
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
