"use client";
import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function useQueryParams<T>() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams?.toString());

  function setQueryParams(params: Partial<T>) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        urlSearchParams.delete(key);
      } else {
        urlSearchParams.set(key, String(value));
      }
    });

    const search = urlSearchParams.toString();
    const query = search ? `?${search}` : "";

    return `${pathname}${query}`;
  }

  const queryParams = useMemo(() => {
    return Object.fromEntries([...searchParams.entries()]);
  }, [searchParams]);

  return { queryParams, setQueryParams };
}
