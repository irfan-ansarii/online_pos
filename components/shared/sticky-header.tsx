"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface StickyHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({
  className,
  children,
}: StickyHeaderProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      const classes = ref.current?.classList;

      if (classes) {
        if (scroll > 200) {
          classes.add("translate-y-[54px]", "z-50");
          classes.remove("border-b");
        } else {
          classes.remove("translate-y-[54px]", "z-50");
          classes.add("border-b");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const containerClass = cn(
    "sticky hidden transition transform duration-500 z-60 md:flex translate-y-[0px] border-b top-[-50px] bg-background px-4 h-[50px] justify-center flex-col",
    className
  );

  return (
    <div className={containerClass} ref={ref}>
      {children}
    </div>
  );
};

export default StickyHeader;
