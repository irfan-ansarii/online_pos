import React from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Inbox, IndianRupee, MapPin, Percent } from "lucide-react";

interface Props {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconClassName?: string;
}
const Analytics = ({ title, value, icon, iconClassName }: Props) => {
  return (
    <Card className="rounded-none md:rounded-md p-4 flex">
      <div className="flex-1">
        <div className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <span className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 inline-flex items-center justify-center">
          {icon}
        </span>
      </div>
    </Card>
  );
};

export default Analytics;
