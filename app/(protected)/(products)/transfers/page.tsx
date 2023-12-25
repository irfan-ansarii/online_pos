import { Transfer } from "@prisma/client";
import { getTransfers } from "@/actions/transfer-actions";

import EmptyBox from "@/components/shared/empty-box";
import ItemCard from "./components/ItemCard";
import Pagination from "@/components/shared/pagination";

interface SearchParamsProps {
  [key: string]: string;
}
interface ResponseProps {
  data: Transfer[];
  pagination: { page: number; pageCount: number };
}

async function TransferPage({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) {
  const { data, pagination }: ResponseProps = await getTransfers(searchParams);

  if (!data || data.length === 0) {
    return <EmptyBox />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:gap-2 items-center">
        {data?.map((transfer: Transfer) => (
          <ItemCard transfer={transfer} key={transfer.id} />
        ))}
      </div>
      <div className="flex items-center justify-center mt-auto">
        <Pagination className="mt-6" pagination={pagination} />
      </div>
    </>
  );
}

export default TransferPage;
