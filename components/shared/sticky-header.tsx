"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/dialog";
interface StickyHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({
  className,
  children,
}: StickyHeaderProps) => {
  const ref = useRef(null);
  const containerClass = cn(
    "hidden duration-500 md:flex border-b bg-background px-4 h-[61px] justify-center flex-col sticky top-0 z-50",
    className
  );
  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      if (scroll > 100) {
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className={containerClass} ref={ref}>
      {children}
    </div>
  );
};

export default StickyHeader;
