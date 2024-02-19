import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Layout = async ({
  children,
  analytics,
  revenue,
  expense,
  payment,
  purchase,
  stock,
  bestSellers,
  employee,
  customers,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  revenue: React.ReactNode;
  expense: React.ReactNode;
  payment: React.ReactNode;
  purchase: React.ReactNode;
  stock: React.ReactNode;
  bestSellers: React.ReactNode;
  employee: React.ReactNode;
  customers: React.ReactNode;
}) => {
  return (
    <>
      <div className="grow p-4 gap-4 md:p-6 md:gap-6">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* page header */}
          {children}

          {/* row 1 */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {analytics}
          </div>

          {/* row 2 */}
          {/* <Card className="col-span-12 xl:col-span-8 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Purchase</CardTitle>
            </CardHeader>
            <CardContent>{purchase}</CardContent>
          </Card> */}
          <Card className="col-span-12 xl:col-span-8 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Revenue</CardTitle>
            </CardHeader>
            <CardContent>{revenue}</CardContent>
          </Card>
          <Card className="col-span-12 md:col-span-6 xl:col-span-4 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Expense</CardTitle>
            </CardHeader>
            <CardContent>{expense}</CardContent>
          </Card>
          {/* row 3 */}
          <Card className="col-span-12 md:col-span-6 xl:col-span-4 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Payments</CardTitle>
            </CardHeader>
            <CardContent>{payment}</CardContent>
          </Card>
          <Card className="col-span-12 md:col-span-6 xl:col-span-4 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Stock</CardTitle>
            </CardHeader>
            <CardContent>{stock}</CardContent>
          </Card>
          <Card className="col-span-12 md:col-span-6 xl:col-span-4 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Top Employees</CardTitle>
            </CardHeader>
            <CardContent>{employee}</CardContent>
          </Card>
          {/* row 4 */}
          <Card className="col-span-12 lg:col-span-6 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Best Sellers</CardTitle>
            </CardHeader>
            <CardContent>{bestSellers}</CardContent>
          </Card>
          <Card className="col-span-12 lg:col-span-6 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Top Customers</CardTitle>
            </CardHeader>
            <CardContent>{customers}</CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Layout;
