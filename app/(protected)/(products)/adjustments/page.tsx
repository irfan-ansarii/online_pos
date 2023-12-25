import { Adjustment, Product, Variant, File } from "@prisma/client";
import { getAdjustments } from "@/actions/adjustment-actions";
import ItemCard from "./components/ItemCard";
import EmptyBox from "@/components/shared/empty-box";
import Pagination from "@/components/shared/pagination";

interface PageProps {
  [key: string]: string;
}

interface ResponseProps {
  data: AdjustmentProps[];
  pagination: { page: number; pageCount: number };
}

interface AdjustmentProps extends Adjustment {
  product: Product & { image: File };
  variant: Variant;
}
async function Page({ searchParams }: { searchParams: PageProps }) {
  const { data, pagination }: ResponseProps = await getAdjustments(
    searchParams
  );

  if (!data || data.length === 0) {
    return <EmptyBox />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:gap-2 items-center">
        {data.map((adjustment) => (
          <ItemCard adjustment={adjustment} key={adjustment.id} />
        ))}
      </div>

      <div className="flex items-center justify-center mt-auto">
        <Pagination className="mt-6" pagination={pagination} />
      </div>
    </>
  );
}

export default Page;
