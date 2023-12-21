import MobileHeader from "@/components/shared/mobile-header";
import React from "react";
import Header from "../components/Header";

import Navigation from "../components/Navigation";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MobileHeader title="Barcodes" />
      <div className="h-[60px] px-4 overflow-x-auto md:hidden border-b">
        <Navigation />
      </div>
      <Header />
      <div className="md:p-6">
        <div className="grid grid-cols-1 md:gap-2 items-center">{children}</div>
      </div>
    </>
  );
};

export default layout;
