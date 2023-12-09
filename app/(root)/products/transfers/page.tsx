"use client";
import React from "react";
import { Plus } from "lucide-react";
import { useTransfers } from "@/hooks/useProduct";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/button";
import MobileHeader from "@/components/shared/mobile-header";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import NewSheet from "./components/NewSheet";
import ItemCard from "./components/ItemCard";
import ErrorBox from "@/components/shared/error-box";
import Loading from "@/components/shared/Loading";
import EmptyBox from "@/components/shared/empty-box";

const Page = () => {
  const { queryParams, setQueryParams } = useQueryParams();
  const {
    data: transfers,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    fetchNextPage,
  } = useTransfers(queryParams);
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  });

  return (
    <>
      <MobileHeader title="Transfers" />
      <main className="grow">
        <Header
          action={
            <NewSheet>
              <Button className="ml-auto">
                <Plus className="w-5 h-5 mr-2" />
                Add
              </Button>
            </NewSheet>
          }
          filters={<div>Filters</div>}
        />

        {/* mobile navigation */}
        <div className="h-[60px] px-4 overflow-x-auto md:hidden">
          <Navigation />
        </div>

        <div className="md:p-6">
          <div className="grid grid-cols-1 md:gap-2 items-center">
            {transfers?.pages.map((page) =>
              page.data.data.length === 0 ? (
                <EmptyBox className="col-span-1" title="No Products Found" />
              ) : (
                page.data.data.map((transfer: any) => (
                  <ItemCard transfer={transfer} key={transfer.id} />
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
