import React from "react";
import Numeral from "numeral";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
const TotalCard = ({ sale }: any) => {
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
        <div className="space-y-1">
          <div className="flex">
            Shipping
            <span className="ml-auto">-{Numeral(0).format()}</span>
          </div>
          <div className="flex">
            {sale.totalDue !== 0
              ? sale.totalDue < 0
                ? "Overpaid"
                : "Due"
              : "Paid"}
            <span className="ml-auto">
              {Numeral(
                Math.abs(sale.totalDue !== 0 ? sale.totalDue : sale.total)
              ).format()}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Badge className="flex rounded-md py-2 w-full">
          Revenue
          <div className="ml-auto">
            {Numeral(sale.total - sale.totalDue - 0).format()}
          </div>
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default TotalCard;
