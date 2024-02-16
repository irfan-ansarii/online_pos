"use client";
import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  stockData: {
    name: string;
    _count: number;
  }[];
  adjustmentData: {
    name: string;
    _sum: number;
  }[];
}

const StockChart = ({ stockData, adjustmentData }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <PieChart>
        <Pie
          data={stockData}
          innerRadius={90}
          outerRadius={120}
          cornerRadius={4}
          paddingAngle={4}
          dataKey="_count"
          stroke="none"
        >
          {stockData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill="red"
              style={{ outline: "none" }}
            />
          ))}
        </Pie>

        <Pie
          data={adjustmentData}
          outerRadius={60}
          dataKey="_sum"
          stroke="none"
        >
          {adjustmentData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill="red"
              style={{ outline: "none" }}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default StockChart;
