import MobileHeader from "@/components/shared/mobile-header";
import React from "react";
import Header from "../components/Header";

import Navigation from "../components/Navigation";
import NewSheet from "./components/NewSheet";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MobileHeader title="Barcodes" />
      <div className="h-[60px] px-4 overflow-x-auto md:hidden border-b">
        <Navigation />
      </div>
      <Header />
      <div className="md:p-6">{children}</div>
      <NewSheet />
    </>
  );
};

export default layout;
