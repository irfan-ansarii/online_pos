import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const SalePage = () => {
  return (
    <Card className="col-span-6">
      <CardHeader>
        <CardTitle className="text-base">Recent Sale</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter>action</CardFooter>
    </Card>
  );
};

export default SalePage;
