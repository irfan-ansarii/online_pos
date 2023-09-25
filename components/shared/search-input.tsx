import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
const SearchInput = () => {
  return (
    <div className="relative">
      <span className="absolute inset-y-0 inline-flex items-center pr-4 text-muted-foreground">
        <Search className="w-5 h-5" />
      </span>
      <Input
        className="bg-transparent rounded-none border-none pl-8 focus-visible:ring-transparent"
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchInput;
