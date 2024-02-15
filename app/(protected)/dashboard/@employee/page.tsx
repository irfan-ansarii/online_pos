import React from "react";
import { getUserAnalytics } from "@/actions/analytics/analytic-actions";

import Numeral from "numeral";

const EmployeePage = async ({ searchParams }: { searchParams: any }) => {
  const { period } = searchParams;
  const { data: employees } = await getUserAnalytics(period);

  const total = employees.reduce(
    (acc, curr) => (acc += curr._sum.total || 0),
    0
  );

  return (
    <div className="space-y-4">
      {employees.map((emp, i) => (
        <div key={i}>
          <div className="flex justify-between mb-1">
            <span className="">{emp.name}</span>
            <span className="text-sm font-medium">
              {Numeral(emp._sum.total).format()}
            </span>
          </div>

          <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-primary h-2.5 rounded-full "
              style={{
                width: `${Math.max(
                  0,
                  Math.round((Number(emp._sum.total || 0) / total) * 100)
                )}%`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeePage;
