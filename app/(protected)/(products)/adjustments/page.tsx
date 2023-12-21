"use client";
import React from "react";
import { Plus } from "lucide-react";
import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import MobileHeader from "@/components/shared/mobile-header";

import Header from "../components/Header";
import Navigation from "../components/Navigation";

import ItemCard from "./components/ItemCard";
import NewSheet from "./components/NewSheet";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useAdjustments } from "@/hooks/useProduct";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import ErrorBox from "@/components/shared/error-box";
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
  } = useAdjustments(queryParams);

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  });

  return (
    <>
      {transfers?.pages.map((page) =>
        page.data.data.length === 0 ? (
          <EmptyBox className="col-span-1" title="No Products Found" />
        ) : (
          page.data.data.map((adjustment: any) => (
            <ItemCard adjustment={adjustment} key={adjustment.id} />
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
    </>
  );
};

export default Page;
