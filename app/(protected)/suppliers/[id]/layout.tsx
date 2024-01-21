import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return <div className="md:p-6">{children}</div>;
};

export default layout;
