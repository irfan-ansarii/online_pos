"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_ITEMS } from "@/config/app";
function Bottombar() {
  const pathname = usePathname();

  const isActive = (current: any) => {
    const active =
      current === pathname ||
      (pathname.length > 1 && current.startsWith(pathname));
    return active ? true : false;
  };

  return (
    <div className="h-[60px] fixed left-0 bottom-0 border-t w-full z-10 md:hidden dark:bg-popover bg-secondary">
      <ul className="grid grid-cols-5 h-full px-4 gap-4 place-items-center	">
        {MENU_ITEMS.slice(0, 5).map((el, i) => {
          const Icon = el.icon;
          return (
            <li
              className="rounded-md overflow-hidden flex w-full h-full items-center justify-center"
              key={`${el.key}-${i}`}
            >
              <Link
                href={el.href}
                className={`justify-center flex h-full flex-col transition duration-500 items-center text-sm font-medium text-foreground ${
                  isActive(el.href) ? "text-primary" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline-flex uppercase text-xs font-semibold mt-1">
                  {el.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Bottombar;
