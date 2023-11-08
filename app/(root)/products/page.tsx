import Link from "next/link";
import { Plus, ArrowRightLeft } from "lucide-react";
import MobileHeader from "@/components/shared/mobile-header";
import StickyHeader from "@/components/shared/sticky-header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SearchInput from "@/components/shared/search-input";
import Products from "./components/Products";
import NewSheet from "./components/NewSheet";
import TransferSheet from "./components/TransferSheet";
const Page = () => {
  return (
    <>
      <MobileHeader title="Products" />
      <main className="grow">
        <StickyHeader>
          <div className="grid grid-cols-2 items-center">
            <SearchInput />
            <div className="relative flex gap-4 justify-start">
              <div className="flex gap-4 border-b-2">
                <Button variant="link">
                  <Link href="/products/barcodes" className="flex items-center">
                    Products
                  </Link>
                </Button>
                <Button variant="link">
                  <Link href="/products/barcodes" className="flex items-center">
                    Barcode List
                  </Link>
                </Button>
                <Button variant="link">
                  <TransferSheet>
                    <span className="inline-flex items-center">
                      Transfer List
                    </span>
                  </TransferSheet>
                </Button>
                <Button variant="link">
                  <Link href="/products/barcodes" className="flex items-center">
                    Adjustments
                  </Link>
                </Button>
              </div>

              <NewSheet>
                <Button className="ml-auto">
                  <Plus className="w-5 h-5 mr-2" />
                  New
                </Button>
              </NewSheet>
            </div>
          </div>
        </StickyHeader>

        <div className="md:p-6">
          <div className="grid grid-cols-1 md:gap-2 items-center">
            <Products />
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
