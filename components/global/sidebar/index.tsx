"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { MENU_ITEMS } from "@/config/app";

import { usePathname } from "next/navigation";

import { ThemeCustomizer } from "@/components/theme/theme-customizer";

import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Customizer from "@/components/global/sidebar/customizer";
import ThemeSwitcher from "@/components/global/sidebar/theme-switcher";
import SearchPanel from "@/components/global/sidebar/search-panel";
import { ChevronRight } from "lucide-react";

function Sidebar() {
  const [active, setActive] = React.useState("");
  const pathname = usePathname();
  const [loading, setLoading] = React.useState(true);

  const isActive = (current: string) => {
    const splitted = pathname.split("/").find((p) => p);

    const active =
      current === pathname ||
      (pathname.length > 1 && current?.startsWith(`/${splitted}`));

    return active;
  };

  const isActiveTrigger = (current: string) => {
    const splitted = pathname.split("/").find((p) => p);
    const item = MENU_ITEMS.find((item) => item.href === current);
    return (
      item &&
      item.children?.some(
        (child) =>
          child.href === pathname ||
          (pathname.length > 1 && current?.startsWith(`/${splitted}`))
      )
    );
  };

  React.useEffect(() => {
    setLoading(false);
  }, []);

  React.useEffect(() => {
    MENU_ITEMS.forEach((item) => {
      const { children } = item;
      if (pathname === item.href) {
        setActive(item.href);
      } else if (Array.isArray(children)) {
        children.forEach((child) => {
          if (pathname === child.href) {
            setActive(item.href);
          }
        });
      }
    });
  }, [pathname]);

  return (
    <div className="top-0 z-30 h-screen w-full shrink-0 sticky">
      <div className="flex flex-col px-4 h-full">
        <div className="shrink-0 -mx-4">
          <div className="h-[60px] flex items-center justify-center">
            <Image
              src="/assets/logo.png"
              width={200}
              height={60}
              alt="logo"
              className="sm:hidden lg:inline-block"
            ></Image>

            <Image
              src="/assets/favicon.png"
              width={60}
              height={60}
              alt="logo"
              className="hidden sm:inline-block lg:hidden"
            ></Image>
          </div>
        </div>
        <div className="py-4">
          <SearchPanel />
        </div>

        <div className="relative flex-1 max-h-full overflow-y-auto scrollbox -mx-x px-x">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={active}
            onValueChange={(value) => setActive(value)}
          >
            <ul className="flex flex-col gap-3">
              {MENU_ITEMS.map((item, i) => {
                const { label, href, icon, children } = item;
                const Icon = icon;
                return (
                  <li className="rounded-md" key={item.key}>
                    {Array.isArray(item.children) &&
                    item.children.length > 0 ? (
                      <AccordionItem value={href} className="border-none">
                        <AccordionTrigger asChild>
                          <div
                            className={cn(
                              `rounded-md w-full [&[data-state=open]>svg]:rotate-90 transition duration-500 cursor-pointer px-2 group md:justify-center lg:px-4 lg:justify-start !py-3 lg:py-2.5 flex gap-3 transition duration-500 items-center text-sm font-medium text-foreground hover:bg-secondary  ${
                                isActiveTrigger(href) ? "bg-secondary" : ""
                              }`
                            )}
                          >
                            <span>
                              <Icon className="w-5 h-5 " />
                            </span>

                            <span className="md:hidden lg:inline-flex">
                              {label}
                            </span>
                            <span className="lg:hidden invisible group-hover:visible absolute left-[calc(100%+10px)] transition duration-500 bg-background text-foreground border p-2 rounded-md max-w-max">
                              {label}
                            </span>
                            <ChevronRight className="w-5 h-5 -mr-2 ml-auto sm:hidden lg:inline-flex transition" />
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="[&>div]:pb-0 [&>div]:pt-3 [&>div]:flex [&>div]:flex-col [&>div]:gap-3">
                          {children?.map((childItem: any) => {
                            const Icon = childItem.icon;
                            return (
                              <MenuLink
                                key={childItem.href}
                                label={childItem.label}
                                href={childItem.href}
                                Icon={Icon}
                                isActive={isActive}
                              />
                            );
                          })}
                        </AccordionContent>
                      </AccordionItem>
                    ) : (
                      <MenuLink
                        label={label}
                        href={href}
                        Icon={Icon}
                        isActive={isActive}
                      />
                    )}
                  </li>
                );
              })}
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

const MenuLink = ({
  label,
  href,
  Icon,
  isActive,
}: {
  label: string;
  href: string;
  Icon: any;
  isActive: (p: any) => boolean;
}) => {
  return (
    <Link
      href={`${href}`}
      className={cn(
        `rounded-md w-full px-2 group md:justify-center lg:px-4 lg:justify-start py-3 lg:py-2.5 flex gap-3 transition duration-500 items-center text-sm font-medium text-foreground hover:bg-secondary  ${
          isActive(href)
            ? "bg-primary hover:bg-primary text-primary-foreground"
            : ""
        }`
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="md:hidden lg:inline-flex">{label}</span>
      <span className="lg:hidden invisible group-hover:visible absolute left-[calc(100%+10px)] transition duration-500 bg-background text-foreground border p-2 rounded-md max-w-max">
        {label}
      </span>
    </Link>
  );
};
