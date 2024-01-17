import React from "react";
import { getSales } from "@/actions/sale-actions";

import EmptyBox from "@/components/shared/empty-box";
import SaleCard from "./components/SaleCard";
import Pagination from "@/components/shared/pagination";
import { Sale } from "@prisma/client";
import { getPayments } from "@/actions/payments-actions";

interface SearchParamsProps {
  [key: string]: string;
}

interface ResponseProps {
  data: Sale[];
  pagination: { page: number; pageCount: number };
}

export default async function CustomerPage({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) {
  const { data, pagination }: ResponseProps = await getSales(searchParams);
  const { data: payments } = await getPayments({ type: "sale" });

  if (!data || data.length === 0) {
    return <EmptyBox />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:gap-2">
        {data?.map((sale) => (
          <SaleCard sale={sale} key={sale.id} payments={payments} />
        ))}
      </div>

      <div className="flex items-center justify-center mt-auto">
        <Pagination className="mt-6" pagination={pagination} />
      </div>
    </>
  );
}
