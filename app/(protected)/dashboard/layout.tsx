import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Layout = ({
  children,
  analytics,
  revenue,
  // expense
  purchase,
  stock,
  bestSellers,
  employee,
  customers,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  revenue: React.ReactNode;
  // expense
  purchase: React.ReactNode;
  stock: React.ReactNode;
  bestSellers: React.ReactNode;
  employee: React.ReactNode;
  customers: React.ReactNode;
}) => {
  return (
    <>
      <div className="grow p-4 gap-4 md:p-6 md:gap-6">
        <div className="grid grid-cols-12 gap-6">
          {/* page header */}
          {children}

          {/* analytics cards */}
          {/* row 1 */}
          <div className="col-span-12 md:col-span-12 grid grid-cols-3 gap-6">
            {analytics}
          </div>

          {/* row 2 */}
          <Card className="col-span-12 xl:col-span-8 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Revenue</CardTitle>
            </CardHeader>
            <CardContent>{revenue}</CardContent>
          </Card>
          <Card className="col-span-12 xl:col-span-4 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Expense</CardTitle>
            </CardHeader>
            <CardContent>Expenses</CardContent>
          </Card>

          {/* row 3 */}
          <Card className="col-span-12 xl:col-span-8 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Purchase</CardTitle>
            </CardHeader>
            <CardContent>{purchase}</CardContent>
          </Card>
          <Card className="col-span-12 xl:col-span-4 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Stock</CardTitle>
            </CardHeader>
            <CardContent>{stock}</CardContent>
          </Card>

          {/* row 4 */}

          <Card className="col-span-12 xl:col-span-4 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Best Sellers</CardTitle>
            </CardHeader>
            <CardContent>{bestSellers}</CardContent>
          </Card>
          <Card className="col-span-12 xl:col-span-4 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Top Employees</CardTitle>
            </CardHeader>
            <CardContent>{employee}</CardContent>
          </Card>
          <Card className="col-span-12 xl:col-span-4 border rounded-md">
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
