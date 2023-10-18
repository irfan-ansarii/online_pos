import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Analytics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
      <Card className="rounded-none md:rounded-md">
        <CardHeader className="flex p-4 flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold">+573</div>
          <p className="text-xs text-muted-foreground">+201 since last hour</p>
        </CardContent>
      </Card>
      <Card className="rounded-none md:rounded-md">
        <CardHeader className="flex p-4 flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold">+573</div>
          <p className="text-xs text-muted-foreground">+201 since last hour</p>
        </CardContent>
      </Card>
      <Card className="rounded-none md:rounded-md">
        <CardHeader className="flex p-4 flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Order Value
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold">+573</div>
          <p className="text-xs text-muted-foreground">+201 since last hour</p>
        </CardContent>
      </Card>
      <Card className="rounded-none md:rounded-md">
        <CardHeader className="flex p-4 flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Visit</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold">+573</div>
          <p className="text-xs text-muted-foreground">+201 since last hour</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
