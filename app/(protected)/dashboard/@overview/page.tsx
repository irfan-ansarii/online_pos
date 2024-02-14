"use client";
import React from "react";

import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "12 Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "13",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "14",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "15",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "16",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "17",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "18",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

const OverviewPage = () => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(false);
  }, []);
  if (loading)
    return (
      <div
        className="flex flex-col h-full items-center justify-center"
        style={{ height: "320px" }}
      >
        <svg
          className="animate-spin w-8 h-8 animate-spin text-primary"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ left: -16, bottom: -6 }}>
        <XAxis
          dataKey="name"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <YAxis
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        {/* <Tooltip cursor={false} /> */}
        <Legend />
        <Bar
          dataKey="total"
          stroke="#ff6b6b"
          fill="#ff6b6b"
          radius={[4, 4, 0, 0]}
          stackId="a"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OverviewPage;
