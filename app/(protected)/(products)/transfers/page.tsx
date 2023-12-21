import { Transfer } from "@prisma/client";
import { fetchData } from "@/lib/api";

import EmptyBox from "@/components/shared/empty-box";
import ItemCard from "./components/ItemCard";

interface SearchParamsProps {
  [key: string]: string;
}

async function Page({ searchParams }: { searchParams: SearchParamsProps }) {
  const { data, pagination } = await fetchData({
    url: "/transfers",
    params: searchParams,
  });

  return (
    <>
      {/* pages */}
      {data?.map((transfer: Transfer) => (
        <ItemCard transfer={transfer} key={transfer.id} />
      ))}

      {data?.length === 0 && <EmptyBox />}
    </>
  );
}

export default Page;
