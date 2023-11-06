// import Header from "@/app/(app)/dashboard/components/header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="md:hidden">{/* <Header /> */}</div>
      <main className="grow md:p-4">{children}</main>
    </>
  );
};

export default Layout;
