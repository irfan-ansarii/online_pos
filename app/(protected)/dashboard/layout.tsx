import Header from "@/components/global/header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="grow md:p-4">{children}</main>
    </>
  );
};

export default Layout;
