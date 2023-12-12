import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MapPin, User } from "lucide-react";
const CustomerCard = ({ customer }: any) => {
  return (
    <Card className="hover:bg-accent">
      <Link href={`customers/${customer.id}`}>
        <CardContent className="grid grid-cols-8 gap-3 items-center relative">
          <div className="flex gap-3 items-center col-span-4 md:col-span-3">
            <Avatar className="border-2">
              <AvatarFallback className="">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="truncate font-medium">{customer.firstName}</div>
              <div className="text-muted-foreground text-xs inline-flex gap-1 items-center">
                <MapPin className="w-3 h-3" />
                <span>Delhi</span>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="text-muted-foreground">{customer.phone}</div>
            <div className="text-muted-foreground">{customer.email}</div>
          </div>

          <div className="hidden md:block col-span-2">
            <div className="inline-flex flex-col gap-0.5 uppercase">
              <Badge
                className="py-0 truncate text-muted-foreground font-normal"
                variant="secondary"
              >
                <span>Orders</span>
                <span className="mx-1 opacity-40">|</span>
                <span className="ml-auto">567</span>
              </Badge>
              <Badge
                className="py-0 truncate text-muted-foreground font-normal"
                variant="secondary"
              >
                <span>total spent</span>
                <span className="mx-1 opacity-40">|</span>
                <span className="ml-auto">10,1900.00</span>
              </Badge>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 text-right">
            <Badge className="uppercase" variant="secondary">
              status
            </Badge>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default CustomerCard;
