import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const Barcode = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <CardTitle className="font-semibold tracking-tight text-base">
          Page Setup
        </CardTitle>

        <CardDescription>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        </CardDescription>

        <CardTitle className="font-semibold tracking-tight text-base">
          Layout
        </CardTitle>
        <CardDescription>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        </CardDescription>

        <CardTitle className="font-semibold tracking-tight text-base">
          Template
        </CardTitle>
        <CardDescription>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        </CardDescription>
      </div>
      <div>
        <Card>
          <CardContent>
            <CardTitle className="font-semibold tracking-tight text-base">
              Preview
            </CardTitle>

            <CardDescription>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Barcode;
