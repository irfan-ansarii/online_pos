import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import MobileHeader from "@/components/shared/mobile-header";
import StickyHeader from "@/components/shared/sticky-header";
import SearchInput from "@/components/shared/search-input";

import AddUserDialog from "./componets/AddUserDialog";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MobileHeader title="Customers" />
      <StickyHeader>
        <div className="grid grid-cols-2 items-center">
          <SearchInput />
          <div className="relative flex gap-4 justify-end">
            <AddUserDialog>
              <Button className="hidden md:flex">
                <Plus className="w-5 h-5 mr-2" />
                New
              </Button>
            </AddUserDialog>
          </div>
        </div>
      </StickyHeader>

      <div className="md:p-6 flex-1 flex flex-col gap-6">{children}</div>

      <AddUserDialog>
        <Button
          size="icon"
          className="rounded-full md:hidden fixed z-50 bottom-[54px] md:bottom-4 left-1/2 -translate-x-1/2 lg:hidden w-12 h-12"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </AddUserDialog>
    </>
  );
};

export default layout;
