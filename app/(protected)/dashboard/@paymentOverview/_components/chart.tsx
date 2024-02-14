"use client";
import React from "react";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface Props {
  data: {
    name: string;
    value: number | null;
  }[];
}
const Chart = ({ data }: Props) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
              fill={COLORS[index % COLORS.length]}
              style={{ outline: "none" }}
            />
          ))}
        </Pie>
        <Legend fontStyle={""} />
      </PieChart>

      {/* <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={60}
          cornerRadius={4}
          paddingAngle={4}
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
        <Pie
          data={data}
          dataKey="value"
          innerRadius={80}
          outerRadius={100}
          label
          cornerRadius={4}
          paddingAngle={4}
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
        <Legend fontStyle={""} />
      </PieChart> */}
    </ResponsiveContainer>
  );
};

export default Chart;
