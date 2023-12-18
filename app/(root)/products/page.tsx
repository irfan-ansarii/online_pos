"use client";
import { ListFilter, Plus, PlusCircle, X } from "lucide-react";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useProducts } from "@/hooks/useProduct";
import { useIntersectionObserver } from "@uidotdev/usehooks";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import MobileHeader from "@/components/shared/mobile-header";

import EmptyBox from "@/components/shared/empty-box";
import ErrorBox from "@/components/shared/error-box";

import ProductCard from "./components/ProductCard";
import Loading from "@/components/shared/Loading";

import Header from "./components/Header";
import NewSheet from "./components/NewSheet";

import Navigation from "./components/Navigation";

const Page = () => {
  const { queryParams, setQueryParams } = useQueryParams();

  const {
    data: products,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
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
            <div className="flex items-center gap-4 justify-end w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto gap-2" variant="secondary">
                    <ListFilter className="w-4 h-4" />
                    <span className="capitalize font-normal">
                      {queryParams.status || "Filters"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 bg-background" align="end">
                  {["active", "archived", "trash"].map((item) => (
                    <DropdownMenuItem
                      className="capitalize"
                      onClick={() => {
                        if (queryParams.status === item) {
                          setQueryParams({ status: null });
                          return;
                        }
                        setQueryParams({ status: item });
                      }}
                    >
                      {item}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setQueryParams({ status: null })}
                  >
                    Clear
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <NewSheet>
                <Button>
                  <Plus className="w-5 h-5 mr-2" />
                  New
                </Button>
              </NewSheet>
            </div>
          }
        />

        {/* mobile navigation */}
        <div className="h-[60px] px-4 overflow-x-auto md:hidden bg-secondary">
          <Navigation />
        </div>
        {/* page content */}
        <div className="md:p-6">
          <div className="grid grid-cols-1 md:gap-2 items-center">
            {/* pages */}

            {products?.pages.map((page) =>
              page.data.data.length === 0 ? (
                <EmptyBox className="col-span-1" title="No Products Found" />
              ) : (
                page.data.data.map((product: any) => (
                  <ProductCard product={product} key={product.id} />
                ))
              )
            )}

            {/* error */}
            {isError && (
              <ErrorBox
                className="col-span-1"
                title={error?.response?.data?.message}
              />
            )}

            {/* {hasNextPage && <div ref={ref}></div>} */}

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
