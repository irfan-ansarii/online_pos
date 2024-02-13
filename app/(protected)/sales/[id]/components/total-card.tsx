import React from "react";
import Numeral from "numeral";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
const TotalCard = ({ sale }: any) => {
  const badge = {
    classsName:
      sale.totalDue === 0
        ? "bg-success hover:bg-success"
        : sale.totalDue < 0
        ? "bg-error hover:bg-error"
        : "bg-warning hover:bg-warning",
    text: sale.totalDue === 0 ? "Paid" : sale.totalDue < 0 ? "Overpaid" : "Due",
    value: Math.abs(sale.totalDue || sale.total),
  };
  return (
    <Card className="rounded-md border overflow-hidden">
      <CardContent>
        <div className="space-y-1">
          <div className="flex">
            Subtotal
            <span className="ml-auto">{Numeral(sale.subtotal).format()}</span>
          </div>
          <div className="flex">
            Discount
            <span className="ml-auto">
              -{Numeral(sale.totalDiscount).format()}
            </span>
          </div>
          <div className="flex">
            Shipping
            <span className="ml-auto">
              {Numeral(sale.totalDiscount).format()}
            </span>
          </div>
          <div className="flex items-center">
            Tax
            <span className="capitalize text-xs text-muted-foreground ml-1">
              ({sale.taxType})
            </span>
            <span className="ml-auto">{Numeral(sale.totalTax).format()}</span>
          </div>
        </div>
        <div className="border-b-2 border-dashed my-2" />

        <div className="flex items-center text-lg font-medium">
          Total
          <span className="ml-auto">{Numeral(sale.total).format()}</span>
        </div>

        <div className="border-b-2 border-dashed my-2" />
      </CardContent>
      <CardFooter>
        <Badge
          className={`flex rounded-md py-2 w-full text-white ${badge.classsName}`}
        >
          {badge.text}
          <div className="ml-auto">{Numeral(badge.value).format()}</div>
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default TotalCard;
