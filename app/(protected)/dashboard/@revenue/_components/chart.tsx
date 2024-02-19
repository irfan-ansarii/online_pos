"use client";
import { getRandomColor } from "@/lib/utils";
import { format } from "date-fns";
import Numeral from "numeral";
import React from "react";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const RevenueBarChart = ({
  data,
  formatter,
}: {
  data: any;
  formatter: string;
}) => {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart margin={{ left: -16, bottom: -6 }} data={data}>
        <XAxis
          dataKey="name"
          fontSize={12}
          tickLine={false}
          axisLine={true}
          strokeOpacity={0.3}
          tickFormatter={(value) => format(new Date(value), formatter)}
        />
        <YAxis fontSize={12} tickLine={false} axisLine={false} />
        <Bar dataKey="_sum" fill={getRandomColor()} radius={[4, 4, 0, 0]} />
        <Tooltip
          cursor={{ fill: "transparent" }}
          content={({ active, payload, label }) => {
            if (!active) return;
            return (
              <div className="bg-secondary/90 p-4 rounded-md text-foreground">
                <div className="flex justify-between gap-4">
                  Period:
                  <span>{format(new Date(label!), formatter)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  Revenue:
                  <span>{Numeral(payload?.[0].value).format()}</span>
                </div>
              </div>
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
