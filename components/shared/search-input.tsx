"use client";
import React from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface QueryParams {
  [key: string]: null;
}
const SearchInput = () => {
  const { queryParams, setQueryParams } = useQueryParams();
  const { search } = queryParams;
  const [searchTerm, setSearchTerm] = React.useState(search);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  React.useEffect(() => {
    const nullParams: QueryParams = Object.fromEntries(
      Object.keys(queryParams).map((key) => [key, null])
    );

    setQueryParams({ ...nullParams, search: debouncedSearchTerm || null });
  }, [debouncedSearchTerm]);

  return (
    <div className="relative">
      <span className="absolute inset-y-0 inline-flex items-center pr-4 text-muted-foreground">
        <Search className="w-5 h-5" />
      </span>
      <Input
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        value={searchTerm || ""}
        className="bg-transparent rounded-none border-none pl-8 focus-visible:ring-transparent"
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchInput;
