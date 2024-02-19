"use client";
import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";

import { useQueryParams } from "@/hooks/useQueryParams";

interface Props {
  pagination: { page: number; pageCount: number };
  className?: string;
}

const Pagination = ({ pagination, className }: Props) => {
  const { setQueryParams } = useQueryParams();

  const { page, pageCount } = pagination;

  return (
    <div className="[&>*]:rounded-none mb-6 md:mb-0 rounded-md overflow-hidden border inline-flex items-center">
      {/* prev button */}

      {page <= 1 ? (
        <Button disabled variant="ghost">
          <ChevronLeft className="w-5 h-5" />
        </Button>
      ) : (
        <Link
          href={`${setQueryParams({ page: page - 1 })}`}
          className={buttonVariants({
            variant: "ghost",
          })}
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      )}

      <span className={`text-muted-foreground px-4`}>
        {page}/{pageCount}
      </span>

      {/* next button */}

      {page === pageCount ? (
        <Button disabled variant="ghost">
          <ChevronRight className="w-5 h-5" />
        </Button>
      ) : (
        <Link
          href={`${setQueryParams({ page: page + 1 })}`}
          className={buttonVariants({
            variant: "ghost",
          })}
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      )}
    </div>
  );
};

export default Pagination;
