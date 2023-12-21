"use client";
import React from "react";
import { useAtom } from "jotai";
import { store } from "@/lib/store";
import { Plus } from "lucide-react";
import StickyHeader from "@/components/shared/sticky-header";
import SearchInput from "@/components/shared/search-input";
import { Button } from "@/components/ui/button";

import Navigation from "./Navigation";

const Header = ({ filters }: { filters?: React.ReactNode }) => {
  const [state, setState] = useAtom(store);
  return (
    <StickyHeader className="justify-start">
      <div className="flex gap-4 flex-1 items-center">
        <Navigation />
        <div className="ml-auto flex-1 max-w-[400px]">
          <SearchInput className="bg-secondary hover:bg-secondary/80 focus:bg-secondary/80" />
        </div>
        {filters}
        <Button onClick={() => setState({ ...state, open: true })}>
          <Plus className="w-5 h-5 mr-2" />
          New
        </Button>
      </div>
    </StickyHeader>
  );
};

export default Header;
