import React from "react";
import { User } from "@prisma/client";

import { getCustomers } from "@/actions/customer-actions";

import EmptyBox from "@/components/shared/empty-box";

import CustomerCard from "./components/CustomerCard";
import Pagination from "@/components/shared/pagination";

interface SearchParamsProps {
  [key: string]: string;
}
interface ResponseProps {
  data: User[];
  pagination: { page: number; pageCount: number };
}

export default async function CustomerPage({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) {
  const { data, pagination }: ResponseProps = await getCustomers(searchParams);

  if (!data || data.length === 0) {
    return <EmptyBox />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:gap-2 items-center">
        {data?.map((customer: User) => (
          <CustomerCard customer={customer} key={customer.id} />
        ))}
      </div>
      <div className="flex items-center justify-center mt-auto">
        <Pagination className="mt-6" pagination={pagination} />
      </div>
    </>
  );
}
