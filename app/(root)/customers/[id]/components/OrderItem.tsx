import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import Numeral from "numeral";
import { Badge } from "@/components/ui/badge";

const Orders = ({ order }: { order: any }) => {
  return (
    <div className="grid grid-cols-5 gap-2 py-3 items-center">
      <div className="space-y-1 col-span-2">
        <Link
          href={`/sales?id=${order.id}`}
          className="text-sm font-medium leading-none"
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
      <div className="flex justify-end items-center col-span-2">
        <Badge
          className="w-40 truncate gap-1 text-muted-foreground"
          variant="secondary"
        >
          <span className="uppercase truncate">{order.status} </span>
          <span>|</span>
          <span className="ml-auto">{Numeral(order.total).format()}</span>
        </Badge>
      </div>
    </div>
  );
};

export default Orders;
