import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Layout = ({
  children,
  analytics,
  revenueOverTime,
  overview,
  paymentOverview,
  profitOverview,
  stockOverview,
  employeeOverview,
  dues,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  revenueOverTime: React.ReactNode;
  overview: React.ReactNode;
  paymentOverview: React.ReactNode;
  profitOverview: React.ReactNode;
  stockOverview: React.ReactNode;
  employeeOverview: React.ReactNode;
  dues: React.ReactNode;
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
            <CardContent>{overview}</CardContent>
          </Card>
          <Card className="col-span-12 xl:col-span-4 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Payment Overview</CardTitle>
            </CardHeader>
            <CardContent>{paymentOverview}</CardContent>
          </Card>

          {/* row 3 */}
          <Card className="col-span-12 xl:col-span-4 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Payment Overview</CardTitle>
            </CardHeader>
            <CardContent>{paymentOverview}</CardContent>
          </Card>

          <Card className="col-span-12 xl:col-span-4 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Employee Overview</CardTitle>
            </CardHeader>
            <CardContent>{employeeOverview}</CardContent>
          </Card>
          <Card className="col-span-12 xl:col-span-4 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Stock Overview</CardTitle>
            </CardHeader>
            <CardContent>{stockOverview}</CardContent>
          </Card>

          {/* <Card className="col-span-12 xl:col-span-8 border rounded-md">
            <CardHeader>
              <CardTitle className="text-base">Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent>{revenueOverTime}</CardContent>
          </Card> */}
        </div>
      </div>
    </>
  );
};

export default Layout;
