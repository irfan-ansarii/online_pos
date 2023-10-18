import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
const Orders = () => {
  return (
    <Card className="rounded-none md:rounded-md">
      <CardHeader className="p-4">
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>Name has made 265 sales this month.</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="divide-y">
          {[...Array(6)].map(() => (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium leading-none">
                  Olivia Martin
                </p>
                <p className="text-sm text-muted-foreground">
                  olivia.martin@email.com
                </p>
              </div>
              <div className="flex">items</div>
              <div className="col-span-2 md:col-span-1">
                <Badge
                  className="justify-between w-full uppercase py-2"
                  variant="secondary"
                >
                  <span className="inline-flex gap-2">cash</span>
                  <span>20,201.00</span>
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Orders;
