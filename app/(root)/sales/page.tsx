import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import SaleCard from "./components/SaleCard";
import Loading from "./components/Loading";
import Filters from "./components/Filters";
import MobileHeader from "@/components/shared/mobile-header";
const Page = () => {
  return (
    <>
      <MobileHeader title="Sales" />
      <main className="grow">
        <Filters />

        <div className="md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-6">
            {[...Array(6)].map((el, i) => (
              <Loading />
            ))}
            {[...Array(18)].map((el, i) => (
              <SaleCard />
            ))}
          </div>
        </div>

        <Button
          size="icon"
          className="rounded-full md:hidden fixed z-50 bottom-[54px] md:bottom-4 left-1/2 -translate-x-1/2 lg:hidden w-12 h-12"
        >
          <Link href="/sales/new">
            <Plus className="w-5 h-5" />
          </Link>
        </Button>
      </main>
    </>
  );
};

export default Page;
