"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianAxis,
} from "recharts";

const data = [
  {
    name: "10 AM",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "12 PM",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "02 PM",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "04 PM",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "06 PM",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "08 PM",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "10 PM",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const RevenueOverTime = () => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart
        data={data}
        margin={{
          left: -16,
          bottom: -6,
        }}
      >
        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} />
        <Legend />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#32a852"
          strokeWidth={4}
          activeDot={{ r: 10 }}
        />
        <Line type="monotone" dataKey="uv" stroke="#a51bcf" strokeWidth={4} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueOverTime;
