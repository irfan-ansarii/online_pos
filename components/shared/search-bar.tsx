import React from "react";

import SearchInput from "@/components/shared/search-input";

const SearchBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative border-b bg-background">
      <div className="h-[50px] md:h-[60px] flex w-full items-center px-4 md:px-6 relative bg-background">
        <SearchInput />
        <div className="absolute right-4 md:right-6 inset-y-0 inline-flex items-center gap-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
