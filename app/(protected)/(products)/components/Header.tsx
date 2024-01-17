"use client";
import React from "react";
import { Plus } from "lucide-react";
import { useSheetToggle } from "@/hooks/useSheet";

import { Button } from "@/components/ui/button";

import Navigation from "./Navigation";
import SearchBar from "@/components/shared/search-bar";

const Header = ({ filters }: { filters?: React.ReactNode }) => {
  const [_, toggle] = useSheetToggle("newSheet");
  return (
    <>
      <div className="h-[50px] border-b px-6 flex items-center">
        <Navigation />
        <Button className="hidden md:flex ml-auto">
          <Plus className="w-5 h-5 mr-1" />
          Create New
        </Button>
      </div>
      <SearchBar>f</SearchBar>
    </>
  );
};

export default Header;
