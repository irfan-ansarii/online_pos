import React from "react";
import { User } from "@prisma/client";

import { getContacts } from "@/actions/contact-actions";

import EmptyBox from "@/components/shared/empty-box";

import CustomerCard from "./components/ContactCard";
import Pagination from "@/components/shared/pagination";

interface SearchParamsProps {
  [key: string]: string;
}
interface ResponseProps {
  data: any[];
  pagination: { page: number; pageCount: number };
}

export default async function CustomerPage({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) {
  const { data, pagination }: ResponseProps = await getContacts(searchParams);

  if (!data || data.length === 0) {
    return <EmptyBox />;
  }

  const max = data?.reduce(
    (acc, curr) => {
      if (curr.role === "supplier") {
        if (curr._sum > acc.purchase) {
          acc.purchase = curr._sum;
        }
      } else {
        if (curr._sum > acc.sale) {
          acc.sale = curr._sum;
        }
      }
      return acc;
    },
    {
      sale: 0,
      purchase: 0,
    }
  );

  return (
    <>
      <div className="grid grid-cols-1 md:gap-2 items-center">
        {data?.map((contact) => {
          const isSupplier = contact.role === "supplier";
          const maxValue = isSupplier ? max.purchase : max.sale;

          const progress = (contact._sum / maxValue) * 100;

          return (
            <CustomerCard
              contact={contact}
              key={contact.id}
              progress={progress}
            />
          );
        })}
      </div>
      <div className="flex items-center justify-center mt-auto">
        <Pagination className="mt-6" pagination={pagination} />
      </div>
    </>
  );
}
