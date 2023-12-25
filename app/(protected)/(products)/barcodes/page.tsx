import React from "react";
import { getBarcodes } from "@/actions/barcode-actions";
import { Label } from "@prisma/client";
import ItemCard from "./components/ItemCard";

import EmptyBox from "@/components/shared/empty-box";
import Pagination from "@/components/shared/pagination";

interface PageProps {
  [key: string]: string;
}

interface ResponseProps {
  data: Label[];
  pagination: { page: number; pageCount: number };
}

async function Page({ searchParams }: { searchParams: PageProps }) {
  const { data, pagination }: ResponseProps = await getBarcodes(searchParams);

  if (!data || data.length === 0) {
    return <EmptyBox />;
  }
  return (
    <>
      <div className="grid grid-cols-1 md:gap-2 items-center">
        {data.map((item) => (
          <ItemCard item={item} key={item.id} />
        ))}
      </div>

      <div className="flex items-center justify-center mt-auto">
        <Pagination className="mt-6" pagination={pagination} />
      </div>
    </>
  );
}

export default Page;
