import React from "react";
import { Card, CardTitle } from "@/components/ui/card";

interface Props {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconClassName?: string;
}
const Analytics = ({ title, value, icon }: Props) => {
  return (
    <Card className="rounded-none md:rounded-md p-6 flex">
      <div className="flex-1 space-y-4">
        <CardTitle className="font-bold">{value}</CardTitle>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </div>
      <div className="flex items-start justify-center text-muted-foreground">
        <span className="w-12 h-12 border-2 bg-secondary/50 rounded-full inline-flex items-center justify-center">
          {icon}
        </span>
      </div>
    </Card>
  );
};

export default Analytics;
