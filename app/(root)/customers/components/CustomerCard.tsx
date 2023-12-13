import React from "react";
import Link from "next/link";
import Numeral from "numeral";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Pencil, User } from "lucide-react";
import { Button } from "@/components/ui/button";

import EditSheet from "./EditSheet";

const CustomerCard = ({ customer }: any) => {
  const getBadgeClass = (amount: number) => {
    if (amount > 50000) return "bg-success hover:bg-success";
    if (amount > 25000) return "bg-info hover:bg-info";
    if (amount > 10000) return "bg-warning hover:bg-warning";

    return "bg-destructive hover:bg-destructive";
  };
  return (
    <Card className="hover:bg-accent group relative">
      <Link href={`customers/${customer.id}`}>
        <CardContent className="grid grid-cols-8 gap-3 items-center relative">
          <div className="flex gap-2 items-center col-span-4 md:col-span-3">
            <Avatar className="border-2 shrink-0">
              <AvatarFallback className="">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <div className="truncate font-medium">{customer.firstName}</div>
              {customer.addresses?.length > 0 ? (
                <div className="text-muted-foreground text-xs inline-flex gap-1 items-center">
                  <MapPin className="w-3 h-3" />
                  <span className="capitalize">
                    {customer.addresses?.[0]?.state}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="col-span-2">
            <div className="text-muted-foreground">{customer.phone}</div>
            <div className="text-muted-foreground">{customer.email}</div>
          </div>

          <div className="hidden md:block col-span-2">
            <div className="inline-flex flex-col gap-0.5 uppercase">
              <Badge
                className="py-0 truncate text-muted-foreground w-40"
                variant="secondary"
              >
                <span>Orders</span>
                <span className="mx-1 opacity-40">|</span>
                <span className="ml-auto">{customer.orders}</span>
              </Badge>
              <Badge
                className={`py-0 truncate text-white w-40 ${getBadgeClass(
                  customer.totalSpent
                )}`}
                variant="secondary"
              >
                <span>spent</span>
                <span className="mx-1 opacity-40">|</span>
                <span className="ml-auto">
                  {Numeral(customer.totalSpent).format()}
                </span>
              </Badge>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 text-right">
            <Badge className="uppercase" variant="secondary">
              Group
            </Badge>
          </div>
        </CardContent>
      </Link>

      <EditSheet customer={customer}>
        <div className="w-28 absolute inset-y-0 right-0 px-4 invisible group-hover:visible bg-accent flex justify-end items-center gap-2">
          <Button variant="secondary" size="icon" className="">
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      </EditSheet>
    </Card>
  );
};

export default CustomerCard;
