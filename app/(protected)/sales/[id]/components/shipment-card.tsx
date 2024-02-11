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
import { Shipment, ShipmentLineItem } from "@prisma/client";

interface Props extends Shipment {
  shipmentLineItems: ShipmentLineItem[];
}

const ShipmentCard = ({ shipment }: { shipment: Props }) => {
  const { shipmentLineItems } = shipment;

  if (shipmentLineItems.length <= 0) {
    return;
  }

  return (
    <Card className="border rounded-md">
      <CardHeader className="py-2 border-b space-y-0 divide-y">
        <div className="flex items-center pb-2">
          {/* title */}
          {shipment.status && (
            <>
              <CardTitle className="text-base">
                <span className="capitalize">{shipment.status}</span>
              </CardTitle>

              {shipment.kind ? (
                <Badge className="ml-2 bg-success hover:bg-success text-white capitalize">
                  {shipment.kind}
                </Badge>
              ) : (
                <Badge className="ml-2 bg-warning hover:bg-warning/80 text-white capitalize">
                  Delayed
                </Badge>
              )}
            </>
          )}

          {/* actions */}
          <div className="flex flex-1 justify-end">
            {/* label */}
            {shipment.labelUrl && (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  Download Label
                </TooltipContent>
              </Tooltip>
            )}

            {/* tracking */}
            {(shipment.awb || shipment.carrier || shipment.trackingUrl) && (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <PenSquare className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  Edit Tracking
                </TooltipContent>
              </Tooltip>
            )}

            {/* cancel shipment */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost">
                  <X className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Cancel</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* carrir related info */}
        {(shipment.carrier || shipment.awb) && (
          <div className="!pt-4 !pb-2 flex">
            {shipment.carrier && `${shipment.carrier}:`}
            {shipment.trackingUrl ? (
              <a
                href={shipment.trackingUrl}
                target="_blank"
                className="ml-1 text-primary underline"
              >
                {shipment.awb}
              </a>
            ) : (
              <span>{shipment.awb}</span>
            )}
            {shipment.charges > -10 && <span>{shipment.charges}</span>}
            <div className="ml-auto">
              EDD: || Delivered
              {shipment.deliveryAt?.toISOString()}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="divide-y">
        {shipmentLineItems?.map((field: any) => (
          <LineItem key={field.id} field={field} />
        ))}
      </CardContent>

      <CardFooter>
        {shipment.status === "processing" ? (
          <Button className="flex w-full">Ship Now</Button>
        ) : (
          <Button className="flex w-full" variant="destructive">
            Create Return
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ShipmentCard;

const ShipmentAction = (status: String) => {
  switch (status) {
    case "processing":
      return (
        <Button className="flex w-full" variant="destructive">
          Ship Now
        </Button>
      );
  }
};