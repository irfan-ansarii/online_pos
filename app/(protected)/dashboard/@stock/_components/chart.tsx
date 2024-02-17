"use client";
import { getRandomColor } from "@/lib/utils";
import React from "react";
import {
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";

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
          data={stockData}
          innerRadius={90}
          outerRadius={120}
          cornerRadius={4}
          paddingAngle={4}
          dataKey="_count"
          legendType="triangle"
          stroke="none"
          label={({ percent }) => {
            return `${(percent * 100).toFixed(0)}%`;
          }}
        >
          {stockData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getColor()}
              style={{ outline: "none" }}
            />
          ))}
          <LabelList dataKey="_count" position="middle" fill="#fff" />
        </Pie>

        <Pie
          data={adjustmentData}
          outerRadius={60}
          dataKey="_sum"
          stroke="none"
          label={({ percent }) => {
            return `${(percent * 100).toFixed(0)}%`;
          }}
        >
          {adjustmentData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getColor()}
              style={{ outline: "none" }}
            />
          ))}
          <LabelList dataKey="_sum" position="middle" fill="#fff" />
        </Pie>

        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default StockChart;
