"use client";
import React from "react";
import StickyHeader from "@/components/shared/sticky-header";
import SearchInput from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRightLeft } from "lucide-react";
const PageHeader = () => {
  return (
    <StickyHeader>
      <div className="grid grid-cols-2 items-center">
        <SearchInput />
        <div className="relative flex gap-4 justify-end">
          <Button className="hidden md:flex">
            <ArrowRightLeft className="w-5 h-5 mr-2" />
            Adjust
          </Button>
          <Button className="hidden md:flex">
            <Plus className="w-5 h-5 mr-2" />
            New
          </Button>
        </div>
      </div>
    </StickyHeader>
  );
};

export default PageHeader;
