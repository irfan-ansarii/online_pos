import MobileHeader from "@/components/shared/mobile-header";
import Filters from "@/app/(app)/sales/components/Filters";
import ProductSheet from "./components/ProductSheet";
const Page = () => {
  return (
    <>
      <MobileHeader title="Products" />
      <main className="grow">
        <Filters />
        <div className="md:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-4">
            {[...Array(18)].map(() => (
              <ProductSheet />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
