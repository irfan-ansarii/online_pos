"use client";
import { CHART_COLORS } from "@/config/app";
import { format } from "date-fns";
import React from "react";

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const timeSlots = [
  "10 AM",
  "11 AM",
  "12 PM",
  "01 PM",
  "02 PM",
  "03 PM",
  "04 PM",
  "05 PM",
  "06 PM",
  "07 PM",
  "08 PM",
  "09 PM",
  "10 PM",
];

export const RevenueBarChart = ({ data }: { data: any }) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ left: -16, bottom: -6 }}>
        <XAxis
          dataKey="name"
          fontSize={12}
          tickLine={false}
          axisLine={true}
          strokeOpacity={0.3}
          tickFormatter={(value) => format(new Date(value), "dd-MMM")}
        />
        <YAxis fontSize={12} tickLine={false} axisLine={false} />
        <Bar
          dataKey="_sum"
          stroke="#ff6b6b"
          fill="#ff6b6b"
          radius={[4, 4, 0, 0]}
          stackId="a"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const RevenueLineChart = ({ data }: { data: any }) => {
  const formatted = timeSlots.reduce((acc, curr) => {
    const slot = data.find(
      (d: any) => format(new Date(d.name), "hh aa") === curr
    );
    // @ts-expect-error
    acc.push({
      name: curr,
      _sum: slot?._sum || 0,
    });

    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart
        data={formatted}
        margin={{
          left: -16,
          bottom: -6,
        }}
      >
        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} />

        <Line
          type="monotone"
          dataKey="_sum"
          stroke={CHART_COLORS[3]}
          strokeWidth={4}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
