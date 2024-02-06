import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const PurchasePage = () => {
  return (
    <Card className="col-span-6">
      <CardHeader>
        <CardTitle className="text-base">Recent Purchase</CardTitle>
        {/* <CardDescription>Overview</CardDescription> */}
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter>action</CardFooter>
    </Card>
  );
};

export default PurchasePage;
