import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileHeader from "@/components/shared/mobile-header";

import Header from "../components/Header";
import Navigation from "../components/Navigation";
import ItemCard from "./components/ItemCard";
import NewSheet from "./components/NewSheet";

const Page = () => {
  return (
    <>
      <MobileHeader title="Products" />
      <main className="grow">
        <Header
          action={
            <NewSheet>
              <Button className="ml-auto">
                <Plus className="w-5 h-5 mr-2" />
                New
              </Button>
            </NewSheet>
          }
          filters={<div>Filters</div>}
        />

        {/* mobile navigation */}
        <div className="h-[60px] px-4 overflow-x-auto md:hidden">
          <Navigation />
        </div>
        <div className="md:p-6">
          <div className="grid grid-cols-1 md:gap-2 items-center">
            {[...Array(10)].map((item) => (
              <ItemCard />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
