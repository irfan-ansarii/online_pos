import Sidebar from "@/components/global/sidebar";
import Header from "@/components/global/header";
import Footer from "@/components/global/footer";
import Bottombar from "@/components/global/bottom-bar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="items-start flex flex-col md:grid md:grid-cols-[80px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)]">
      <Sidebar />
      <div className="flex flex-col h-full min-h-screen w-full">
        <Header />
        {children}
        <Footer />
      </div>
      <Bottombar />
    </div>
  );
}
