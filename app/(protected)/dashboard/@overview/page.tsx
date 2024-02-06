import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const OverviewPage = () => {
  return (
    <Card className="col-span-8">
      <CardHeader>
        <CardTitle className="text-base">Overview</CardTitle>
        {/* <CardDescription>Overview</CardDescription> */}
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter>action</CardFooter>
    </Card>
  );
};

export default OverviewPage;
