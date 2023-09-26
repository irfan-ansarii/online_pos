import Link from "next/link";
import MobileHeader from "@/components/shared/mobile-header";
import ProductCard from "./components/ProductCard";
import PageHeader from "./components/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRightLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
      <Button className="rounded-full md:hidden fixed z-50 bottom-[54px] md:bottom-4 left-1/2 -translate-x-1/2 h-12">
        <Link href="/products/adjust" className="flex items-center gap-1">
          <ArrowRightLeft className="w-4 h-4" /> Adjust
        </Link>
        <Separator orientation="vertical" className="mx-2 h-4 w-0.5" />
        <Link href="/products/new" className="flex items-center gap-1">
          <Plus className="w-4 h-4" /> New
        </Link>
      </Button>
    </>
  );
};

export default Page;
