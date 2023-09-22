"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface StickyHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({
  className,
  children,
}: StickyHeaderProps) => {
  const containerClass = cn(
    "sticky top-0 hidden duration-500 z-50 md:flex  border-b bg-background px-4 h-[61px] justify-center flex-col",
    className
  );

  return <div className={containerClass}>{children}</div>;
};

export default StickyHeader;
