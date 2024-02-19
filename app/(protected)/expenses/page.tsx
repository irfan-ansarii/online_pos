import React from "react";
import { Expense } from "@prisma/client";
import { getExpenses } from "@/actions/expense-actions";

import EmptyBox from "@/components/shared/empty-box";
import ExpenseCard from "./components/ExpenseCard";
import Pagination from "@/components/shared/pagination";

interface SearchParamsProps {
  [key: string]: string;
}

interface ResponseProps {
  data: Expense[];
  pagination: { page: number; pageCount: number };
}

export default async function PurchasePage({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) {
  const { data: purchases, pagination }: ResponseProps =
    await getExpenses(searchParams);

  if (!purchases || purchases.length === 0) {
    return <EmptyBox />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:gap-2">
        {purchases?.map((purchase) => (
          <ExpenseCard expense={purchase} key={purchase.id} />
        ))}
      </div>

      <div className="flex items-center justify-center mt-auto">
        <Pagination className="mt-6" pagination={pagination} />
      </div>
    </>
  );
}
