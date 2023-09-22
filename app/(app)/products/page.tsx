import MobileHeader from "@/components/shared/mobile-header";
import Filters from "@/app/(app)/sales/components/Filters";
import ProductCard from "./components/ProductCard";
const Page = () => {
  return (
    <>
      <MobileHeader title="Products" />
      <main className="grow">
        <Filters />
        <div className="px-1 py-4 md:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(18)].map(() => (
              <ProductCard />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
