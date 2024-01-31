import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import SearchBar from "@/components/shared/search-bar";
import AddUserDialog from "./componets/AddUserDialog";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SearchBar>
        <AddUserDialog>
          <Button className="hidden md:flex">
            <Plus className="w-5 h-5 mr-2" />
            Invite
          </Button>
        </AddUserDialog>
      </SearchBar>

      <div className="md:p-6 flex-1 flex flex-col gap-6">{children}</div>

      <AddUserDialog>
        <Button className="rounded-full md:hidden fixed z-50 bottom-[54px] md:bottom-4 left-1/2 -translate-x-1/2 lg:hidden w-auto h-8">
          <Plus className="w-5 h-5 mr-1" />
          Invite
        </Button>
      </AddUserDialog>
    </>
  );
};

export default layout;
