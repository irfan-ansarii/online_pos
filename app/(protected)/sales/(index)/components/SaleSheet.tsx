"use client";
import React from "react";
import { Payment, Transaction } from "@prisma/client";
import { format } from "date-fns";
import Numeral from "numeral";

import { useToggle } from "@uidotdev/usehooks";

import { ChevronDown, Clock, Download, Truck } from "lucide-react";
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
import { Button } from "@/components/ui/button";

const SaleSheet = ({
  children,
  sale,
  payments,
}: {
  sale: any;
  children: React.ReactNode;
  payments: Payment[];
}) => {
  const [open, toggle] = useToggle();

  return (
    <Sheet open={open} onOpenChange={toggle}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="md:max-w-lg">
        <div className="flex flex-col h-full">
          {/* header */}
          <SheetHeader>
            <div className="flex justify-between items-center gap-2">
              <SheetTitle>{sale.title}</SheetTitle>
              <SheetActions sale={sale} toggle={toggle} payments={payments} />
            </div>
          </SheetHeader>

          {/* customer info starts here */}
          <div className="border rounded-md mb-4">
            <Collapsible className="group">
              <CollapsibleTrigger asChild>
                <span
                  role="button"
                  className="font-normal flex w-full cursor-pointer p-3 group-data-[state=open]:pb-0"
                >
                  {sale.shippingAddress?.name}
                  <ChevronDown className="w-4 h-4 ml-auto group-data-[state=open]:rotate-180" />
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-3 pt-0">
                <div> {sale.shippingAddress?.address}</div>

                <div>
                  {sale.shippingAddress?.city} {sale.shippingAddress?.state}
                  {sale.shippingAddress?.pinode}
                </div>

                <div> {sale.shippingAddress?.phone}</div>
                <div> {sale.shippingAddress?.email}</div>
                {sale.shippingAddress?.gstin && (
                  <div className="uppercase">
                    GSTIN: {sale.shippingAddress?.gstin}
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
          {/* customer info ends here */}

          {/* line items starts here */}
          <div className="relative  grow max-h-full overflow-auto space-y-3 scrollbox mb-4">
            <div>
              <div className="rounded-md border overflow-hidden">
                <div className="bg-accent pl-4">
                  <div className="flex items-center">
                    <Badge className="rounded-md">
                      <Truck className="w-4 h-4 mr-1" />
                      Fulfilled
                    </Badge>
                    <div className="ml-auto">
                      Trackon Courier:
                      <a
                        href="https://goldysnestt.com"
                        target="_blank"
                        className="ml-1 text-primary underline"
                      >
                        657574536474
                      </a>
                    </div>
                    <Button size="icon" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-2 space-y-2 divide-y">
                  {sale?.lineItems?.map((field: any) => (
                    <div className="flex py-2 items-center " key={field?.id}>
                      <AvatarItem src={field?.product?.image?.src} />

                      <div className="space-y-0.5 truncate flex-1 mx-3">
                        <div className="font-medium truncate">
                          {field?.title}
                        </div>
                        <div className="flex w-full gap-4">
                          {field?.variantTitle !== "Default" && (
                            <Badge className="py-0" variant="secondary">
                              {field?.variantTitle}
                            </Badge>
                          )}
                          <div className="text-muted-foreground">
                            {Numeral(field?.price).format()} x {field?.quantity}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-0.5 text-right pl-4">
                        <div className="line-through text-muted-foreground">
                          {Number(field?.totalDiscount) > 0
                            ? Numeral(field?.totalDiscount).format()
                            : null}
                        </div>
                        <div className="font-medium">
                          {Numeral(field?.total).format()}
                        </div>
                        {field?.quantity === 0 && (
                          <Badge
                            className="py-0 rounded-md capitalize"
                            variant="destructive"
                          >
                            Removed
                          </Badge>
                        )}

                        {field?.kind === "return" && field?.quantity !== 0 && (
                          <Badge
                            className="py-0 px-1.5 rounded-md capitalize"
                            variant="destructive"
                          >
                            Returned
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* temporary */}
            <div>
              <div className="rounded-md border overflow-hidden">
                <div className="bg-accent flex p-4">
                  <Badge className="rounded-md">
                    <Clock className="w-4 h-4 mr-2" />
                    Pending
                  </Badge>
                </div>
                <div className="p-2 space-y-2 divide-y">
                  {sale?.lineItems?.map((field: any) => (
                    <div className="flex py-2 items-center " key={field?.id}>
                      <AvatarItem src={field?.product?.image?.src} />

                      <div className="space-y-0.5 truncate flex-1 mx-3">
                        <div className="font-medium truncate">
                          {field?.title}
                        </div>
                        <div className="flex w-full gap-4">
                          {field?.variantTitle !== "Default" && (
                            <Badge className="py-0" variant="secondary">
                              {field?.variantTitle}
                            </Badge>
                          )}
                          <div className="text-muted-foreground">
                            {Numeral(field?.price).format()} x {field?.quantity}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-0.5 text-right pl-4">
                        <div className="line-through text-muted-foreground">
                          {Number(field?.totalDiscount) > 0
                            ? Numeral(field?.totalDiscount).format()
                            : null}
                        </div>
                        <div className="font-medium">
                          {Numeral(field?.total).format()}
                        </div>
                        {field?.quantity === 0 && (
                          <Badge
                            className="py-0 rounded-md capitalize"
                            variant="destructive"
                          >
                            Removed
                          </Badge>
                        )}

                        {field?.kind === "return" && field?.quantity !== 0 && (
                          <Badge
                            className="py-0 px-1.5 rounded-md capitalize"
                            variant="destructive"
                          >
                            Returned
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* temporary */}
          </div>
          {/* line items ends here */}

          {/* sale total starts here */}
          <div className="border-t-2 pt-2 border-dashed">
            <div className="flex justify-between py-1">
              <div>Subtotal</div>
              <div>{Numeral(sale.subtotal).format()}</div>
            </div>
            <div className="flex justify-between py-1">
              <div>Discount</div>
              <div>{Numeral(sale.totalDiscount).format()}</div>
            </div>
            <div className="flex justify-between py-1">
              <div>Tax</div>
              <div>{Numeral(sale.totalTax).format()}</div>
            </div>

            <div className="border-b-2 border-dashed my-2" />

            {/* transactions starts here */}
            <Collapsible className="space-y-2 group">
              <div className="flex items-center text-lg font-medium">
                Total
                {sale?.transactions?.length > 0 && (
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
                <div className="ml-auto"> {Numeral(sale.total).format()}</div>
              </div>

              <CollapsibleContent className="divide-y border-t">
                {sale.transactions.map((transaction: Transaction) => (
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
            {/* transactions ends here */}

            {/* sale due starts here */}
            {sale.totalDue !== 0 && (
              <div className="flex items-center p-2 mt-2 rounded-md bg-warning/20">
                <div>{sale.totalDue < 0 ? "Refund Due" : "Payment Due"}</div>
                <div className="ml-auto">
                  {Numeral(Math.abs(sale.totalDue)).format()}
                </div>
              </div>
            )}
            {/* sale due ends here */}
          </div>
          {/* sale total ends here */}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SaleSheet;
