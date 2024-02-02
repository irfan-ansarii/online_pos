import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import Sidebar from "@/components/global/sidebar";
import Header from "@/components/global/header";
import Footer from "@/components/global/footer";
import Bottombar from "@/components/global/bottom-bar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="items-start flex flex-col md:grid md:grid-cols-[80px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)] ">
      <div className="hidden md:block h-full  bg-accent sticky">
        <Sidebar />
      </div>
      <div className="flex flex-col h-full min-h-screen w-full relative">
        <Header />
        <main className="flex-1 flex flex-col h-full">{children}</main>
        <Footer />
      </div>
      <Bottombar />
    </div>
  );
}
