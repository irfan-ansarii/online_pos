import React from "react";

import MobileHeader from "@/components/shared/mobile-header";

import Header from "./components/Header";

import Navigation from "./components/Navigation";

const template = ({ children }) => {
  return (
    <>
      <MobileHeader title="Products" />
      <main className="grow">
        <Header />

        {/* mobile navigation */}
        <div className="h-[60px] px-4 overflow-x-auto md:hidden bg-secondary">
          <Navigation />
        </div>
        {/* page content */}
        <div className="md:p-6">
          <div className="grid grid-cols-1 md:gap-2 items-center">
            {children}
          </div>
        </div>
      </main>
    </>
  );
};

export default template;
