import React from "react";
import format from "date-fns/format";
import Numeral from "numeral";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarGroup, AvatarItem } from "@/components/shared/avatar";
import { cn } from "@/lib/utils";
import SaleSheet from "./SaleSheet";

const SaleCard = ({ sale }: { sale: any }) => {
  const status: { [key: string]: any } = {
    pending: {
      className: "bg-warning hover:bg-warning text-white",
      text: "Pending",
    },
    paid: {
      className: "bg-success hover:bg-success text-white",
      text: "Paid",
    },
    partialy_paid: {
      className: "bg-info hover:bg-info text-white",
      text: "Partial",
    },
    partially_refunded: {
      className: "bg-destructive hover:bg-destructive text-white",
      text: "Partial",
    },
    refunded: {
      className: "bg-destructive hover:bg-destructive text-white",
      text: "Refunded",
    },
  };

  return (
    <Card className="hover:bg-accent group relative cursor-pointer">
      <SaleSheet sale={sale}>
        <CardContent className="grid grid-cols-8 gap-3 items-center">
          <div className="flex gap-3 col-span-4">
            <div className="border-r pr-4 text-center shrink-0">
              <div className="text-lg leading-tight font-semibold">
                {format(sale.createdAt, "dd")}
              </div>
              <div className="leading-tight text-xs text-muted-foreground">
                {format(sale.createdAt, "MMM yy")}
              </div>
            </div>

            <div className="flex -space-x-2 truncate">
              <AvatarGroup maxCount={2}>
                {sale?.lineItems?.map((lineItem: any) => (
                  <AvatarItem
                    key={lineItem.id}
                    src={`/${lineItem?.product?.image?.src}`}
                  />
                ))}
              </AvatarGroup>
            </div>
          </div>

          <div className="block col-span-2 space-y-0.5">
            <div className="font-medium uppercase">{sale.title}</div>
            <span className="text-muted-foreground">
              {sale.employee.firstName}
            </span>
          </div>

          <div className="hidden md:flex flex-col space-y-0.5">
            <div className="font-medium">{sale.customer.firstName}</div>
            <div className="text-muted-foreground">{sale.customer.phone}</div>
          </div>
          <div className="col-span-2 md:col-span-1 space-y-0.5  text-right">
            <div>{Numeral(sale.total).format()}</div>
            <Badge
              variant="secondary"
              className={cn(
                `rounded-md uppercase`,
                status[sale.status].className
              )}
            >
              {status[sale.status].text}
            </Badge>
          </div>
        </CardContent>
      </SaleSheet>
    </Card>
  );
};

export default SaleCard;
