"use client";
import React from "react";

import { AlignLeft, ArrowLeft } from "lucide-react";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import Sidebar from "../sidebar";
import { useToggle } from "@uidotdev/usehooks";

const PageTitle = () => {
  const [open, toggle] = useToggle(false);
  const pathname = usePathname();
  const router = useRouter();

  const [path, id] = pathname.split("/").filter((el) => el !== "");

  return (
    <>
      {path === "dashboard" ? (
        <Button
          size="icon"
          variant="ghost"
          className="-ml-2 md:hidden"
          onClick={() => toggle()}
        >
          <AlignLeft className="w-6 h-6" />
        </Button>
      ) : (
        <Button
          size="icon"
          variant="ghost"
          className="-ml-1 w-auto md:hidden hover:bg-transparent"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="capitalize font-semibold text-base">
            {id ? id : path}
          </span>
        </Button>
      )}

      {/* if path is dashbpard then render sidebar sheet */}
      <Sheet open={open} onOpenChange={toggle}>
        <SheetContent className="px-0">
          {/* <div className="px-4">
            <SheetHeader>Menu</SheetHeader>
          </div> */}
          <Sidebar />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default PageTitle;
