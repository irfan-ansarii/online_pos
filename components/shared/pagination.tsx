"use client";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useQueryParams } from "@/hooks/useQueryParams";

interface Props {
  pagination: { page: number; pageCount: number };
  className?: string;
}

const Pagination = ({ pagination, className }: Props) => {
  const { setQueryParams } = useQueryParams();
  const { page, pageCount } = pagination;

  return (
    <div className="[&>button]:rounded-none rounded-md overflow-hidden inline-flex items-center divide-x-2 divide-accent">
      {/* prev button */}
      <Button
        size="icon"
        variant="secondary"
        className="bg-secondary/70"
        disabled={page === 1}
        onClick={() => setQueryParams({ page: page === 2 ? null : page - 1 })}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      {[-1, 0, 1].map((offset) => {
        const pageNumber = page + offset;

        if (pageNumber >= 1 && pageNumber <= pageCount) {
          return (
            <Button
              key={pageNumber}
              size="icon"
              variant="secondary"
              className={`bg-secondary/70${offset === 0 ? " primary" : ""}`}
              onClick={() =>
                setQueryParams({ page: pageNumber === 1 ? null : pageNumber })
              }
              disabled={offset === 0}
            >
              {pageNumber}
            </Button>
          );
        }

        return null;
      })}

      {/* next button */}
      <Button
        size="icon"
        variant="secondary"
        className="bg-secondary/70"
        disabled={page === pageCount}
        onClick={() => setQueryParams({ page: Math.min(page + 1, pageCount) })}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Pagination;
