import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Numeral from "numeral";

import { Badge } from "@/components/ui/badge";

const Orders = ({ order }: { order: any }) => {
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
    <div className="grid grid-cols-5 gap-2 py-3 items-center">
      <div className="space-y-1 col-span-2">
        <Link
          href={`/sales?id=${order.id}`}
          className="text-sm font-medium leading-none underline"
        >
          {order?.title}
        </Link>
        <p className="text-sm text-muted-foreground">
          {format(new Date(order.createdAt), "dd MMM, yyyy")}
        </p>
      </div>
      <div className="flex flex-col space-y-1">
        <span className="text-xs font-medium uppercase text-muted-foreground">
          items
        </span>
        <span>{order._count.lineItems}</span>
      </div>
      <div className="col-span-2 text-right">
        <p>{Numeral(order.total).format()}</p>

        <Badge
          className={cn(`rounded-md uppercase`, status[order.status].className)}
        >
          {status[order.status].text}
        </Badge>
      </div>
    </div>
  );
};

export default Orders;
