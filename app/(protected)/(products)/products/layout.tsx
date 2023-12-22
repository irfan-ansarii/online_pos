import MobileHeader from "@/components/shared/mobile-header";
import React from "react";
import Header from "../components/Header";

import Navigation from "../components/Navigation";
import Filters from "./components/Filters";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MobileHeader title="Products" />
      <div className="h-[60px] px-4 overflow-x-auto md:hidden border-b">
        <Navigation />
      </div>
      <Header filters={<Filters />} />
      <div className="md:p-6">{children}</div>
    </>
  );
};

export default layout;
