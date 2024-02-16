import React from "react";
import { getUserAnalytics } from "@/actions/analytics/analytic-actions";

import Chart from "./_components/chart";

const EmployeePage = async ({ searchParams }: { searchParams: any }) => {
  const { period } = searchParams;
  const { data: employees } = await getUserAnalytics(period);

  const data = employees.map((emp) => ({
    name: emp.name!,
    value: emp._sum.total,
  }));

  return <Chart data={data} />;
};

export default EmployeePage;
