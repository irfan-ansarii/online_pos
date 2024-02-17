import React from "react";
import { getUserAnalytics } from "@/actions/analytics/analytic-actions";

import Chart from "./_components/chart";
import PiePlaceholder from "../_components/pie-placeholder";

const EmployeePage = async ({ searchParams }: { searchParams: any }) => {
  const { period } = searchParams;
  const { data: employees } = await getUserAnalytics(period);

  const data = employees.map((emp) => ({
    name: emp.name!,
    value: emp._sum.total,
  }));
  if (!data || data.length === 0) {
    return <PiePlaceholder />;
  }
  return <Chart data={data} />;
};

export default EmployeePage;
