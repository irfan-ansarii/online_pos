"use client";
import React from "react";
import { Transaction } from "@prisma/client";
import { format } from "date-fns";
import Numeral from "numeral";

import { useToggle } from "@uidotdev/usehooks";

import { ChevronDown, X } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AvatarItem } from "@/components/shared/avatar";
import { Badge } from "@/components/ui/badge";

import SheetActions from "./SheetActions";

const PurchaseSheet = ({
  children,
  purchase,
  payments,
}: {
  purchase: any;
  children: React.ReactNode;
  payments: any;
}) => {
  const [open, toggle] = useToggle();

  return (
    <Sheet open={open} onOpenChange={toggle}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="md:max-w-lg">
        <div className="flex flex-col h-full ">
          <SheetHeader>
            <div className="flex justify-between items-center gap-2">
              <SheetTitle>{purchase.title}</SheetTitle>

              <SheetActions
                purchase={purchase}
                toggle={toggle}
                payments={payments}
              />
            </div>
          </SheetHeader>
          <div className="relative  grow max-h-full overflow-auto snap-y snap-mandatory space-y-2 scrollbox mb-4">
            {purchase.lineItems.map((field: any) => (
              <div
                className="flex rounded-md border p-2 items-center snap-start"
                key={field.id}
              >
                <AvatarItem src={field?.product?.image?.src} />

                <div className="space-y-0.5 truncate flex-1 mx-3">
                  <div className="font-medium truncate">{field.title}</div>
                  <div className="flex w-full gap-4">
                    {field.variantTitle && (
                      <Badge className="py-0" variant="secondary">
                        {field.variantTitle}
                      </Badge>
                    )}
                    <div className="text-muted-foreground">
                      {Numeral(field.price).format()} x {field.quantity}
                    </div>
                  </div>
                </div>

                <div className="space-y-0.5 text-right pl-4">
                  <div className="line-through text-muted-foreground">
                    {Number(field.totalDiscount) > 0
                      ? Numeral(field.totalDiscount).format()
                      : null}
                  </div>
                  <div className="font-medium">
                    {Numeral(field.total).format()}
                  </div>
                  {field.quantity === 0 && (
                    <Badge
                      className="py-0 rounded-md uppercase"
                      variant="destructive"
                    >
                      Removed
                    </Badge>
                  )}

                  {field.kind === "return" && field.quantity !== 0 && (
                    <Badge
                      className="py-0 px-1.5 rounded-md uppercase "
                      variant="destructive"
                    >
                      Returned
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t-2 pt-2 border-dashed">
            <div className="flex justify-between py-1">
              <div>Subtotal</div>
              <div>{Numeral(purchase.subtotal).format()}</div>
            </div>
            <div className="flex justify-between py-1">
              <div>Discount</div>
              <div>{Numeral(purchase.totalDiscount).format()}</div>
            </div>
            <div className="flex justify-between py-1">
              <div>Tax</div>
              <div>{Numeral(purchase.totalTax).format()}</div>
            </div>

            <div className="border-b-2 border-dashed my-2" />
            <Collapsible className="space-y-2 group">
              <div className="flex items-center text-lg font-medium">
                Total
                {purchase?.transactions?.length > 0 && (
                  <CollapsibleTrigger asChild>
                    <span
                      role="button"
                      className="text-muted-foreground text-xs font-normal ml-2 inline-flex cursor-pointer"
                    >
                      View transactions
                      <ChevronDown className="w-4 h-4 ml-2 group-data-[state=open]:rotate-180" />
                    </span>
                  </CollapsibleTrigger>
                )}
                <div className="ml-auto">
                  {" "}
                  {Numeral(purchase.total).format()}
                </div>
              </div>

              <CollapsibleContent className="divide-y border-t">
                {purchase.transactions.map((transaction: Transaction) => (
                  <div className="py-2" key={transaction.id}>
                    <div className="flex gap-2 items-center">
                      <div>
                        <div>{transaction.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(transaction.createdAt, "dd MMM, yyyy")}
                        </div>
                      </div>
                      {transaction.kind === "refund" ? (
                        <div className="ml-auto text-right text-error">
                          -{Numeral(transaction.amount).format()}
                        </div>
                      ) : (
                        <div className="ml-auto text-right text-success">
                          +{Numeral(transaction.amount).format()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {purchase.totalDue !== 0 && (
              <div className="flex items-center p-2 mt-2 rounded-md bg-warning/20">
                <div>
                  {purchase.totalDue < 0 ? "Refund Due" : "Payment Due"}
                </div>
                <div className="ml-auto">
                  {Numeral(Math.abs(purchase.totalDue)).format()}
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PurchaseSheet;