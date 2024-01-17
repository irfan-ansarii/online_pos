import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import SearchBar from "@/components/shared/search-bar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SearchBar>
        <Button asChild>
          <Link href="/purchase/new" className="hidden md:inline-flex ml-2">
            <Plus className="w-5 h-5 mr-1" />
            Create New
          </Link>
        </Button>
      </SearchBar>

      <div className="md:p-6 flex-1 flex flex-col gap-6">{children}</div>

      <Link
        href="/purchase/new"
        className={`!rounded-full md:hidden fixed z-50 bottom-[54px] md:bottom-4 left-1/2 -translate-x-1/2 lg:hidden w-auto h-8 ${buttonVariants()}`}
      >
        <Plus className="w-5 h-5 mr-1" /> New
      </Link>
    </>
  );
};

export default layout;
