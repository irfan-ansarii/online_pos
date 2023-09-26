import Link from "next/link";
import MobileHeader from "@/components/shared/mobile-header";
import ProductCard from "./components/ProductCard";
import PageHeader from "./components/PageHeader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import NewSheet from "./components/NewSheet";
import TransferSheet from "./components/TransferSheet";
const Page = () => {
  return (
    <>
      <MobileHeader title="Products" />
      <main className="grow">
        <PageHeader />
        <div className="md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-6">
            {[...Array(18)].map(() => (
              <ProductCard />
            ))}
          </div>
        </div>
      </main>
      <Button className="rounded-full md:hidden fixed z-50 bottom-[54px] md:bottom-4 left-1/2 -translate-x-1/2 h-8">
        <Link
          href="/products/adjust"
          className="flex items-center gap-1 w-16 justify-center"
        >
          Barocde
        </Link>
        <Separator
          orientation="vertical"
          className="mx-2 h-4 w-0.5 bg-primary-foreground"
        />
        <TransferSheet>
          <span className="flex items-center gap-1 w-16 justify-center">
            Transfer
          </span>
        </TransferSheet>
        <Separator
          orientation="vertical"
          className="mx-2 h-4 w-0.5 bg-primary-foreground"
        />
        <NewSheet>
          <span className="flex items-center gap-1 w-16 justify-center">
            New
          </span>
        </NewSheet>
      </Button>
    </>
  );
};

export default Page;
