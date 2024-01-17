"use client";
import React from "react";
import { Search } from "lucide-react";

import { useDebounce } from "@uidotdev/usehooks";
import { useQueryParams } from "@/hooks/useQueryParams";

import { Input } from "@/components/ui/input";

interface QueryParams {
  [key: string]: null;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const { queryParams, setQueryParams } = useQueryParams();
    const { search } = queryParams;
    const [searchTerm, setSearchTerm] = React.useState(search);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    React.useEffect(() => {
      if (!debouncedSearchTerm && searchTerm) {
        const nullParams: QueryParams = Object.fromEntries(
          Object.keys(queryParams).map((key) => [key, null])
        );
        setQueryParams({ ...nullParams, search: debouncedSearchTerm || null });
      } else {
        setQueryParams({ search: searchTerm });
      }
    }, [debouncedSearchTerm, searchTerm, queryParams, setQueryParams]);

    return (
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-0 inline-flex items-center pr-4 text-muted-foreground">
          <Search className="w-5 h-5" />
        </span>
        <Input
          {...props}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          ref={ref}
          value={searchTerm || ""}
          className={`bg-transparent border-none pl-8 focus-visible:ring-transparent  ${className}`}
          placeholder="Search..."
        />
      </div>
    );
  }
);

export default SearchInput;
