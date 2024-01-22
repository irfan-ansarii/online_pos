import React from "react";
import CreateButton from "../components/create-button";
import NewSheet from "./components/NewSheet";
import SearchBar from "@/components/shared/search-bar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SearchBar>
        {/* sort and filters */}

        <CreateButton className="hidden md:flex ml-auto" />
      </SearchBar>
      <div className="md:p-6 flex-1 flex flex-col gap-6">{children}</div>
      <NewSheet />

      <CreateButton
        className="rounded-full md:hidden fixed z-50 bottom-[54px] md:bottom-4 left-1/2 -translate-x-1/2 lg:hidden w-auto h-8"
        text="New"
      />
    </>
  );
};

export default layout;
