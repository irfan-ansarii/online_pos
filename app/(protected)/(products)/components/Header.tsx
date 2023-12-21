"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import StickyHeader from "@/components/shared/sticky-header";
import SearchInput from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";

import Navigation from "./Navigation";

const Header = ({ filters }: { filters?: React.ReactNode }) => {
  const router = useRouter();
  const path = usePathname();

  const onClick = () => {
    router.push(`${path}?sheet=new`);
  };

  return (
    <StickyHeader className="justify-start">
      <div className="flex gap-4 flex-1 items-center">
        <Navigation />
        <div className="ml-auto flex-1 max-w-[400px]">
          <SearchInput className="bg-secondary hover:bg-secondary/80 focus:bg-secondary/80" />
        </div>
        {filters}
        <Button onClick={onClick}>
          <Plus className="w-5 h-5 mr-2" />
          New
        </Button>
      </div>
    </StickyHeader>
  );
};

export default Header;
