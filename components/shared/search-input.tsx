"use client";
import React from "react";
import { Search } from "lucide-react";

import { useDebounce } from "@uidotdev/usehooks";
import { useQueryParams } from "@/hooks/useQueryParams";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const { queryParams, setQueryParams } = useQueryParams();
    const { search } = queryParams;
    const router = useRouter();

    const [searchTerm, setSearchTerm] = React.useState(search);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    React.useEffect(() => {
      Object.keys(queryParams).forEach((key) => {
        if (key !== "search") {
          setQueryParams({ [key]: null });
        }
      });

      const path = setQueryParams({ search: debouncedSearchTerm || null });
      router.push(path);
    }, [debouncedSearchTerm]);

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
