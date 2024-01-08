import React from "react";
import { getPurchases } from "@/actions/purchase-actions";

import EmptyBox from "@/components/shared/empty-box";
import PurchaseCard from "./components/PurchaseCard";
import Pagination from "@/components/shared/pagination";
import { Purchase } from "@prisma/client";

interface SearchParamsProps {
  [key: string]: string;
}

interface ResponseProps {
  data: Purchase[];
  pagination: { page: number; pageCount: number };
}

export default async function PurchasePage({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) {
  const { data: purchases, pagination }: ResponseProps = await getPurchases(
    searchParams
  );

  if (!purchases || purchases.length === 0) {
    return <EmptyBox />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:gap-2">
        {purchases?.map((purchase) => (
          <PurchaseCard purchase={purchase} key={purchase.id} />
        ))}
      </div>

      <div className="flex items-center justify-center mt-auto">
        <Pagination className="mt-6" pagination={pagination} />
      </div>
    </>
  );
}
