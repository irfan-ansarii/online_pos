"use client";
import React from "react";

import { useCustomers } from "@/hooks/useCustomer";
import { useQueryParams } from "@/hooks/useQueryParams";

import MobileHeader from "@/components/shared/mobile-header";
import AddCustomerSheet from "./components/AddCustomerSheet";
import StickyHeader from "@/components/shared/sticky-header";
import SearchInput from "@/components/shared/search-input";

import Loading from "@/components/shared/Loading";
import EmptyBox from "@/components/shared/empty-box";
import ErrorBox from "@/components/shared/error-box";

import CustomerCard from "./components/CustomerCard";

const Page = () => {
  const { queryParams } = useQueryParams();

  const {
    data: customers,
    isLoading,
    isError,
    error,
  } = useCustomers(queryParams);
  return (
    <>
      <MobileHeader title="Customers" />
      <main className="grow">
        <StickyHeader>
          <div className="grid grid-cols-2 items-center">
            <SearchInput />
            <div className="relative flex gap-4 justify-end">
              <AddCustomerSheet />
            </div>
          </div>
        </StickyHeader>
        <div className="md:p-6">
          <div className="grid grid-cols-1 md:gap-2">
            {isLoading && [...Array(6)].map((_, i) => <Loading key={i} />)}

            {/* pages */}

            {customers?.pages.map((page) =>
              page.data.data.length === 0 ? (
                <EmptyBox className="col-span-1" title="No Users Found" />
              ) : (
                page.data.data.map((customer: any) => (
                  <CustomerCard customer={customer} key={customer.id} />
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
          </div>
        </div>
        <AddCustomerSheet className="md:hidden" />
      </main>
    </>
  );
};

export default Page;
