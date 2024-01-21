import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import StickyHeader from "@/components/shared/search-bar";

import AddCustomerSheet from "./components/AddCustomerSheet";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* <StickyHeader
        showFilter={true}
        showSorting={true}
        action={
          <AddCustomerSheet>
            <Button className="hidden md:flex">
              <Plus className="w-5 h-5 mr-2" />
              Create New
            </Button>
          </AddCustomerSheet>
        }
      ></StickyHeader> */}

      <div className="md:p-6 flex-1 flex flex-col gap-6">{children}</div>

      <AddCustomerSheet>
        <Button
          size="icon"
          className="rounded-full md:hidden fixed z-50 bottom-[54px] md:bottom-4 left-1/2 -translate-x-1/2 lg:hidden w-12 h-12"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </AddCustomerSheet>
    </>
  );
};

export default layout;
