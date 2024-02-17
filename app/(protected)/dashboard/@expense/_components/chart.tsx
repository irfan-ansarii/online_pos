"use client";
import React from "react";
import { capitalize, getRandomColor } from "@/lib/utils";
import Numeral from "numeral";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";

interface Props {
  data: {
    name: string;
    value: number | null;
  }[];
}
const Chart = ({ data }: Props) => {
  const usedColors: string[] = [];

  const getColor = () => {
    let color;
    do {
      color = getRandomColor();
    } while (usedColors.includes(color));
    usedColors.push(color);
    return color;
  };

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
          legendType="triangle"
          label={({ percent }) => `${(percent * 100).toFixed()}%`}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getColor()}
              style={{ outline: "none" }}
            />
          ))}
          <LabelList
            dataKey="value"
            position="insideEnd"
            fill="#fff"
            formatter={(v: any) => Numeral(v).format()}
          />
        </Pie>
        <Legend formatter={(value) => capitalize(value)} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Chart;
