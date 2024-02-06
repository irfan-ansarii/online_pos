import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const DuePage = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle className="text-base">Dues</CardTitle>
        {/* <CardDescription>Overview</CardDescription> */}
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter>action</CardFooter>
    </Card>
  );
};

export default DuePage;
