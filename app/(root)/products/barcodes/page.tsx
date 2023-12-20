"use client";
import React from "react";
import { Plus, Printer } from "lucide-react";
import MobileHeader from "@/components/shared/mobile-header";
import { Button } from "@/components/ui/button";

import Header from "../components/Header";
import Navigation from "../components/Navigation";
import ItemCard from "./components/ItemCard";
import NewSheet from "./components/NewSheet";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useBarcodes } from "@/hooks/useProduct";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import EmptyBox from "@/components/shared/empty-box";
import ErrorBox from "@/components/shared/error-box";
import Loading from "@/components/shared/Loading";

const Page = () => {
  const { queryParams } = useQueryParams();
  const {
    data: transfers,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    fetchNextPage,
  } = useBarcodes(queryParams);

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
            <div className="flex justify-end items-center w-full gap-4">
              <Button variant="secondary">
                <Printer className="w-4 h-4 mr-2" /> Print
              </Button>
              <NewSheet>
                <Button>
                  <Plus className="w-5 h-5 mr-2" />
                  Add Items
                </Button>
              </NewSheet>
            </div>
          }
        />

        {/* mobile navigation */}
        {/* <div className="h-[60px] px-4 overflow-x-auto md:hidden">
          <Navigation />
        </div> */}
        <div className="md:p-6">
          <div className="grid grid-cols-1 md:gap-2 items-center">
            {transfers?.pages.map((page) =>
              page.data.data.length === 0 ? (
                <EmptyBox className="col-span-1" title="No Products Found" />
              ) : (
                page.data.data.map((item: any) => (
                  <ItemCard item={item} key={item.id} />
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
