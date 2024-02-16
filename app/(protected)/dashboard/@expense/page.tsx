"use client";
import React from "react";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const PaymentOverviewPage = () => {
  const data = [
    { name: "Total", value: 400 },
    { name: "In Stock", value: 300 },
    { name: "Out of Stock", value: 300 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <ResponsiveContainer width="100%" height={340}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={90}
          outerRadius={120}
          cornerRadius={4}
          paddingAngle={4}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              style={{ outline: "none" }}
            />
          ))}
        </Pie>

        <Legend fontSize={10} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PaymentOverviewPage;
