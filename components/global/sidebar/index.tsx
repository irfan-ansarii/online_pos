"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeCustomizer } from "@/components/theme/theme-customizer";

import { MENU_ITEMS } from "@/config/app";
import { Separator } from "@/components/ui/separator";
import Customizer from "@/components/global/sidebar/customizer";
import ThemeSwitcher from "@/components/global/sidebar/theme-switcher";
import SearchPanel from "@/components/global/sidebar/search-panel";

import { cn } from "@/lib/utils";
function Sidebar() {
  const pathname = usePathname();
  const [loaded, setLoaded] = React.useState(false);

  const isActive = (current: any) => {
    const splitted = pathname.split("/").find((p) => p);
    const active =
      current === pathname ||
      (pathname.length > 1 && current.startsWith(`/${splitted}`));
    return active ? true : false;
  };

  React.useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <div className="top-0 z-30 hidden h-screen w-full bg-accent shrink-0 sticky md:block ">
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
          <ul className="flex flex-col gap-3">
            {MENU_ITEMS.map((el, i) => {
              const Icon = el.icon;
              return (
                <li
                  className="rounded-md overflow-hidden"
                  key={`${el.key}-${i}`}
                >
                  <Link
                    href={el.href}
                    className={cn(
                      `px-2 group md:justify-center lg:px-4 lg:justify-start py-3 lg:py-2.5 flex gap-3 transition duration-500 items-center text-sm font-medium text-foreground hover:bg-secondary dark:hover:bg-secondary/50  ${
                        isActive(el.href)
                          ? "bg-secondary dark:bg-secondary/50  text-primary"
                          : ""
                      }`
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="md:hidden lg:inline-flex">{el.label}</span>
                    <span className="lg:hidden invisible group-hover:visible absolute left-[calc(100%+10px)] transition duration-500 bg-background text-foreground border p-2 rounded-md max-w-max">
                      {el.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-4">
          <Separator className="hidden lg:block" />
          <ThemeSwitcher className="" />
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
