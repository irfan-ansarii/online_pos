"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeCustomizer } from "@/components/theme/theme-customizer";
import { Skeleton } from "@/components/ui/skeleton";
import { MENU_ITEMS } from "@/config/app";
import { Separator } from "@/components/ui/separator";
import Customizer from "@/components/global/sidebar/customizer";
import ThemeSwitcher from "@/components/global/sidebar/theme-switcher";
import SearchPanel from "@/components/global/sidebar/search-panel";
import { ScrollArea } from "@/components/ui/scroll-area";

function Sidebar() {
  const pathname = usePathname();
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const isActive = (current: any) => {
    const active =
      current === pathname ||
      (pathname.length > 1 && current.startsWith(pathname));
    return active ? true : false;
  };
  React.useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <div className="top-0 z-30 hidden h-screen w-full shrink-0 sticky md:block ">
      <div className="flex flex-col px-4 h-full border-r">
        <div className="h-[60px] border-b">logo</div>
        <div className="py-4">
          <SearchPanel />
        </div>
        <div className="grow">
          <ScrollArea>
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
                      className={`px-2 group md:justify-center lg:px-4 lg:justify-start py-3 lg:py-2.5 flex gap-3 transition duration-500 items-center text-sm font-medium text-foreground hover:bg-accent  ${
                        isActive(el.href)
                          ? "bg-primary hover:bg-primary text-primary-foreground"
                          : ""
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="md:hidden lg:inline-flex">
                        {el.label}
                      </span>
                      <span className="lg:hidden invisible group-hover:visible absolute left-[calc(100%+10px)] transition duration-500 bg-background text-foreground border p-2 rounded-md max-w-max">
                        {el.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        </div>

        <div>
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
