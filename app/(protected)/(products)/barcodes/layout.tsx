import React from "react";
import Header from "../components/Header";

import Navigation from "../components/Navigation";
import NewSheet from "./components/NewSheet";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* <Header /> */}
      <div className="md:p-6 flex-1 flex flex-col gap-6">{children}</div>
      <NewSheet />
    </>
  );
};

export default layout;
