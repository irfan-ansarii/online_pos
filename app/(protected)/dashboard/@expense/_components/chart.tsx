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
  Tooltip,
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
        </Pie>
        <Legend formatter={(value) => capitalize(value)} />
        <Tooltip
          content={({ active, payload }) => {
            if (!active) return;
            return (
              <div className="bg-secondary/90 p-4 rounded-md text-foreground">
                <div className="flex justify-between gap-4">
                  {payload?.[0].name}
                </div>
                <div className="flex justify-between gap-4">
                  Value :<span>{Numeral(payload?.[0].value).format()}</span>
                </div>
              </div>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Chart;
