"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const settingRoutes = [
  {
    label: "Application",
    slug: "/application",
  },
  {
    label: "Sale",
    slug: "/sale",
  },
  {
    label: "Purchase",
    slug: "/purchase",
  },
  {
    label: "Sale Invoice",
    slug: "/sale-invoice",
  },
  {
    label: "Purchase Invoice",
    slug: "/purchase-invoice",
  },
  {
    label: "Barcode Label",
    slug: "/barcode",
  },
  {
    label: "Email and Mesage",
    slug: "/email-message",
  },
  {
    label: "Notifications",
    slug: "/notifications",
  },
];
const linkClassName = `${buttonVariants({ variant: "ghost" })} !justify-start w-auto lg:w-full`;

const Navigations = () => {
  const pathname = usePathname();
  const [path, slug] = pathname?.split("/").filter((h) => h);
  const isActive = (path: string) => {
    return slug === path.replace("/", "");
  };

  return (
    <div className="gap-2 flex flex-wrap lg:flex-col">
      {settingRoutes.map((route) => (
        <Link
          key={route.slug}
          href={`/${path}${route.slug}`}
          className={`${linkClassName} ${isActive(route.slug) ? "bg-primary text-primary-foreground" : ""}`}
        >
          {route.label}
        </Link>
      ))}
    </div>
  );
};

export default Navigations;
