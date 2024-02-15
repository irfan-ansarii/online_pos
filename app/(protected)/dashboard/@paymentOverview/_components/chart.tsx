"use client";
import { CHART_COLORS } from "@/config/app";
import { capitalize } from "@/lib/utils";
import React from "react";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface Props {
  data: {
    name: string;
    value: number | null;
  }[];
}
const Chart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={80}
          cornerRadius={4}
          paddingAngle={4}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
              style={{ outline: "none" }}
            />
          ))}
        </Pie>
        <Legend formatter={(value) => capitalize(value)} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Chart;
