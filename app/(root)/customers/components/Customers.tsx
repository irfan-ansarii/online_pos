"use client";
import React from "react";
import CustomerCard from "./CustomerCard";
import Loading from "../../users/componets/Loading";
import { useCustomers } from "@/hooks/useCustomer";
import EmptyBox from "@/components/shared/empty-box";
import ErrorBox from "@/components/shared/error-box";
const Customers = () => {
  const { data: customers, isLoading, isError, error } = useCustomers({});

  return (
    <>
      {/* loading */}

      {isLoading && [...Array(6)].map((_, i) => <Loading key={i} />)}

      {/* pages */}

      {customers?.pages.map((page) =>
        page.data.data.length === 0 ? (
          <EmptyBox
            className="col-span-1 md:col-span-2 xl:col-span-3"
            title="No Users Found"
          />
        ) : (
          page.data.data.map((customer: any) => (
            <CustomerCard customer={customer} key={customer.id} />
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
    </>
  );
};

export default Customers;
