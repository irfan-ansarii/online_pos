import React from "react";
import { Card, CardTitle } from "@/components/ui/card";

interface Props {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  className?: string;
}

const Analytics = ({ title, value, icon, className }: Props) => {
  return (
    <Card className="rounded-none md:rounded-md p-6 flex">
      <div className="flex-1 space-y-4">
        <CardTitle className="font-bold">{value}</CardTitle>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </div>

      <span
        className={`w-10 h-10 rounded-full inline-flex items-center justify-center ${className}`}
      >
        {icon}
      </span>
    </Card>
  );
};

export default Analytics;
