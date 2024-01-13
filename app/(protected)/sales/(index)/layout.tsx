import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import Filters from "./components/Filters";
import MobileHeader from "@/components/shared/mobile-header";
import StickyHeader from "@/components/shared/sticky-header";
import SearchInput from "@/components/shared/search-input";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MobileHeader title="Sales" />
      <StickyHeader>
        <div className="grid grid-cols-2 items-center">
          <SearchInput />
          <div className="relative flex gap-4 justify-end">
            <Filters />

            <Button asChild>
              <Link href="/sales/new">
                <Plus className="w-5 h-5 mr-2" />
                New
              </Link>
            </Button>
          </div>
        </div>
      </StickyHeader>

      <div className="md:p-6 flex-1 flex flex-col gap-6">{children}</div>

      <Link
        href="/sales/new"
        className={`!rounded-full md:hidden fixed z-50 bottom-[54px] md:bottom-4 left-1/2 -translate-x-1/2 lg:hidden w-12 h-12 ${buttonVariants(
          {
            size: "icon",
          }
        )}`}
      >
        <Plus className="w-5 h-5" />
      </Link>
    </>
  );
};

export default layout;
