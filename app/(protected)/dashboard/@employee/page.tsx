import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const EmployeePage = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-base">Employee Performane</CardTitle>
        {/* <CardDescription>Overview</CardDescription> */}
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter>action</CardFooter>
    </Card>
  );
};

export default EmployeePage;
