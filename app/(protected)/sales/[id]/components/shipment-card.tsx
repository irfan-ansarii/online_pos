import React from "react";
import { Download, PenSquare, X } from "lucide-react";

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  TooltipContent,
  Tooltip,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import LineItem from "./line-item";

const ShipmentCard = ({ shipment }) => {
  const { lineItems } = shipment;
  return (
    <Card className="border rounded-md">
      <CardHeader className="py-2 border-b space-y-0">
        <div className="flex items-center">
          <CardTitle className="text-base">
            Out For Delivery
            <Badge className="ml-2 bg-success hover:bg-success text-white">
              Forward
            </Badge>
          </CardTitle>

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="ml-auto">
                <Download className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">Download Label</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost">
                <PenSquare className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">Edit Tracking</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost">
                <X className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">Cancel</TooltipContent>
          </Tooltip>
        </div>
        <div className="!mb-2">
          Trackon Courier:
          <a
            href="https://goldysnestt.com"
            target="_blank"
            className="ml-1 text-primary underline"
          >
            657574536474
          </a>
        </div>
      </CardHeader>

      <CardContent className="divide-y">
        {lineItems?.map((field: any) => (
          <LineItem key={field.id} field={field} />
        ))}
      </CardContent>
      <CardFooter>
        <Button className="flex w-full" variant="destructive">
          Create Return
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShipmentCard;
