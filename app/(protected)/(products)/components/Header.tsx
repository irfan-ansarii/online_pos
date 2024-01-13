"use client";
import React from "react";
import { Plus } from "lucide-react";
import { useSheetToggle } from "@/hooks/useSheet";
import StickyHeader from "@/components/shared/sticky-header";
import SearchInput from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";

import Navigation from "./Navigation";

const Header = ({ filters }: { filters?: React.ReactNode }) => {
  const [_, toggle] = useSheetToggle("newSheet");
  return (
    <>
      <StickyHeader className="justify-start">
        <div className="flex gap-4 flex-1 items-center">
          <Navigation />
          <div className="ml-auto flex-1 max-w-[400px]">
            <SearchInput className="bg-secondary hover:bg-secondary/50 focus:bg-secondary/50" />
          </div>
          {filters}
          <Button onClick={toggle}>
            <Plus className="w-5 h-5 mr-2" />
            New
          </Button>
        </div>
      </StickyHeader>
      <Button
        onClick={toggle}
        size="icon"
        className="rounded-full md:hidden fixed z-50 bottom-[54px] md:bottom-4 left-1/2 -translate-x-1/2 lg:hidden w-12 h-12"
      >
        <Plus className="w-5 h-5" />
      </Button>
    </>
  );
};

export default Header;
