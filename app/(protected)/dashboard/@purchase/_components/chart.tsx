"use client";
import { CHART_COLORS } from "@/config/app";
import { getRandomColor } from "@/lib/utils";
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

export const RevenueBarChart = ({
  data,
  formatter,
  group,
}: {
  data: any;
  formatter: string;
  group: string;
}) => {
  const formatted = timeSlots.reduce((acc, curr) => {
    const slot = data.find(
      (d: any) => format(new Date(d.name), formatter) === curr
    );

    const date = new Date();
    date.setHours(parseInt(curr));

    // @ts-expect-error
    acc.push({
      name: date,
      _sum: slot?._sum || 0,
    });

    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={group === "hour" ? formatted : data}
        margin={{ left: -16, bottom: -6 }}
      >
        <XAxis
          dataKey="name"
          fontSize={12}
          tickLine={false}
          axisLine={true}
          strokeOpacity={0.3}
          tickFormatter={(value) => format(new Date(value), formatter)}
        />
        <YAxis fontSize={12} tickLine={false} axisLine={false} />
        <Bar
          dataKey="_sum"
          fill={getRandomColor()}
          radius={[4, 4, 0, 0]}
          stackId="a"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
