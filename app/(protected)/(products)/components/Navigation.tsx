"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRODUCT_PATHS } from "@/config/app";
const Navigation = () => {
  const pathname = usePathname();

  const isActive = (current: any) => {
    const active = current === pathname;
    return active ? true : false;
  };
  return (
    <ul className="flex gap-4 h-full justify-between">
      {PRODUCT_PATHS.map((path) => (
        <li className="h-full flex relative group items-center" key={path.id}>
          <Link href={path.path} className="inline-flex h-full items-center">
            {path.label}
          </Link>
          <span
            className={`absolute transition duration-300 group-hover:opacity-100 inset-x-0 bottom-0 h-1 bg-primary rounded-t-md ${
              isActive(path.path) ? "opacity-100" : "opacity-0"
            }`}
          ></span>
        </li>
      ))}
    </ul>
  );
};

export default Navigation;
