import MobileHeader from "@/components/shared/mobile-header";
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MobileHeader title="My Tasks" />
      <main className="flex-1">{children}</main>
    </>
  );
};

export default Layout;
