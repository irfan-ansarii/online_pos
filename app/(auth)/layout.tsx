import React from "react";
import { redirect } from "next/navigation";

const layout = ({ children }: { children: React.ReactNode }) => {
  // const { session } = auth();

  // if (session) {
  //   redirect("/dashboard");
  // }

  return children;
};

export default layout;
