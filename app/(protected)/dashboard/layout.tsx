const Layout = ({
  children,
  analytics,
  overview,
  paymentOverview,
  employee,
  dues,
  recentPurchase,
  recentSale,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  overview: React.ReactNode;
  paymentOverview: React.ReactNode;
  reports: React.ReactNode;
  employee: React.ReactNode;
  dues: React.ReactNode;
  recentPurchase: React.ReactNode;
  recentSale: React.ReactNode;
}) => {
  return (
    <>
      {children}
      <main className="grow md:p-6">
        <div className="grid grid-cols-12 gap-6">
          {analytics}

          {/* row 2 */}
          {overview}
          {paymentOverview}

          {/* row 3 */}
          {overview}
          {dues}

          {/* row 5 */}
          <div className="col-span-4 border p-4 h-72">stock</div>
          {employee}
          <div className="col-span-4 border p-4">top customers</div>

          {/* row 6 */}
          {recentPurchase}
          {recentSale}
        </div>
      </main>
    </>
  );
};

export default Layout;
