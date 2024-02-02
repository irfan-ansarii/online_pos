import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Card } from "@/components/ui/card";

async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-[url('/assets/auth-cover.webp')] bg-cover">
      <div className="flex flex-col h-screen justify-center">
        <Card className="w-full sm:max-w-md p-6 border-0 sm:border shadow-none sm:shadow mx-auto bg-background/70 backdrop-blur-md">
          {children}
        </Card>
      </div>
    </div>
  );
}

export default AuthLayout;
