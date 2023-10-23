"use client";
import React from "react";

import { Search, ScanLine } from "lucide-react";

import { useProducts } from "@/hooks/useProduct";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useDebounce } from "@uidotdev/usehooks";
import { useToggle } from "@uidotdev/usehooks";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

import EmptyBox from "@/components/shared/empty-box";
import ErrorBox from "@/components/shared/error-box";
import ProductCard from "./ProductCard";
import Scanner from "./Scanner";

import ProductLoading from "./ProductLoading";

const Products = ({ lineItems }: { lineItems: any }) => {
  const [open, toggle] = useToggle(false);

  const { queryParams, setQueryParams } = useQueryParams();
  const search = queryParams?.get("search");
  const [searchTerm, setSearchTerm] = React.useState(search);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data: products, isLoading, isError, error } = useProducts({});

  React.useEffect(() => {
    setQueryParams({ search: debouncedSearchTerm || null });
  }, [debouncedSearchTerm]);

  return (
    <>
      <Dialog open={open} onOpenChange={toggle}>
        <div className="flex items-center h-[61px] border-b sticky top-0 z-50 bg-background mb-4">
          <div className="relative grow">
            <Input
              type="text"
              className="bg-transparent rounded-none border-none pl-10 focus-visible:ring-transparent"
              placeholder="Search..."
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              value={searchTerm || ""}
            />
            <span className="absolute left-0 inset-y-0 h-full flex items-center justify-center w-10 text-muted-foreground">
              <Search className="w-5 h-5" />
            </span>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 w-10 inset-y-0 h-full flex items-center justify-center text-muted-foreground"
              >
                <ScanLine className="w-5 h-5" />
              </Button>
            </DialogTrigger>
          </div>
        </div>
        <DialogContent className="p-0 overflow-hidden max-h-md bottom-auto top-6">
          <Scanner open={open} toggle={toggle} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2  xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {/* loading cards */}
        {isLoading && [...Array(6)].map((_, i) => <ProductLoading key={i} />)}

        {products?.pages.map((page) =>
          page.data.data.length === 0 ? (
            <EmptyBox
              className="col-span-2 sm:col-span-3 md:col-span-3 lg:col-span-3 xl:col-span-4 2xl:col-span-5"
              title="No Product Found"
            />
          ) : (
            page.data.data.map((product: any) => {
              return (
                <ProductCard
                  product={product}
                  key={product.id}
                  lineItems={lineItems}
                />
              );
            })
          )
        )}
        {/* error box */}
        {isError && (
          <ErrorBox
            className="col-span-2 sm:col-span-3 md:col-span-3 lg:col-span-3 xl:col-span-4 2xl:col-span-5"
            title={error?.response?.data?.message}
          />
        )}
      </div>
    </>
  );
};

export default Products;
