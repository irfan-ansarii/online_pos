import MobileHeader from "@/components/shared/mobile-header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MobileHeader title="Settings" />
      <main className="grow md:p-4">{children}</main>
    </>
  );
};

export default Layout;
