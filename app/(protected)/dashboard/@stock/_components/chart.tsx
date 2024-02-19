"use client";
import { getRandomColor } from "@/lib/utils";
import React from "react";
import Numeral from "numeral";
import {
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
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
          {adjustmentData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getColor()}
              style={{ outline: "none" }}
            />
          ))}
        </Pie>

        <Legend />
        <Tooltip
          content={({ active, payload }) => {
            if (!active) return;
            return (
              <div className="bg-secondary/90 p-4 rounded-md text-foreground">
                <div className="flex justify-between gap-4">
                  {payload?.[0].name}
                </div>
                <div className="flex justify-between gap-4">
                  Value :<span>{payload?.[0].value}</span>
                </div>
              </div>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default StockChart;
