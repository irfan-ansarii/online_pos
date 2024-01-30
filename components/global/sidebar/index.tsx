"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { MENU_ITEMS } from "@/config/app";

import { usePathname } from "next/navigation";

import { ThemeCustomizer } from "@/components/theme/theme-customizer";

import { Separator } from "@/components/ui/separator";
import { Accordion } from "@/components/ui/accordion";

import Customizer from "@/components/global/sidebar/customizer";
import ThemeSwitcher from "@/components/global/sidebar/theme-switcher";
import SearchPanel from "@/components/global/sidebar/search-panel";
import MenuItem from "./menu-item";

function Sidebar() {
  const [active, setActive] = React.useState("");
  const pathname = usePathname();
  const [loading, setLoading] = React.useState(true);

  const isActive = (current: any) => {
    const splitted = pathname.split("/").find((p) => p);
    const active =
      current === pathname ||
      (pathname.length > 1 && current.startsWith(`/${splitted}`));
    return active ? true : false;
  };

  React.useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="top-0 z-30 hidden h-screen w-full bg-accent shrink-0 sticky md:block">
      <div className="flex flex-col px-4 h-full">
        <div className="shrink-0 -mx-4">
          <div className="h-[60px] flex items-center justify-center">
            <Image src="/logo.png" width={200} height={60} alt="logo"></Image>
          </div>
        </div>
        <div className="py-4">
          <SearchPanel />
        </div>

        <div className="relative flex-1 max-h-full overflow-y-auto scrollbox -mx-x px-x">
          <Accordion type="single" collapsible className="w-full">
            <ul className="flex flex-col gap-3">
              {MENU_ITEMS.map((item, i) => (
                <MenuItem
                  label={item.label}
                  href={item.href}
                  icon={item.icon}
                  isActive={isActive}
                  children={item.children}
                />
              ))}
            </ul>
          </Accordion>
        </div>

        <div className="mt-4">
          <Separator className="hidden lg:block" />

          {!loading && <ThemeSwitcher />}

          <Separator className="mb-2 hidden lg:block" />
          <div className="pb-4 hidden lg:block">
            <ThemeCustomizer />
          </div>
          <div className="pb-4 lg:hidden mt-2">
            <Customizer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
