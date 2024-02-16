"use client";
import { getRandomColor } from "@/lib/utils";
import { format } from "date-fns";
import React from "react";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const timeSlots = [
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
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
      <BarChart margin={{ left: -16, bottom: -6 }}>
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
          data={group === "hour" ? formatted : data}
          dataKey="_sum"
          fill={getRandomColor()}
          radius={[4, 4, 0, 0]}
          stackId="a"
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getRandomColor()}
              style={{ outline: "none" }}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
