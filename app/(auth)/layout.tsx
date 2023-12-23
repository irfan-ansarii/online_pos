import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = auth();

  if (session) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}

export default AuthLayout;
