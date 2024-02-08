import React from "react";
import { getSale } from "@/actions/sale-actions";

import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { ChevronDown, Clock, Download, PenSquare, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Numeral from "numeral";
import { Button } from "@/components/ui/button";
import { AvatarItem } from "@/components/shared/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { format } from "date-fns";
import { Transaction } from "@prisma/client";
interface Props {
  params: {
    id: string;
  };
}

const SalePage = async ({ params: { id } }: Props) => {
  const parsedId = parseInt(id);

  const { data: sale } = await getSale(parsedId);

  return (
    <div className="grow">
      {/* header */}
      <div className="relative border-b bg-background">
        <div className="h-[50px] md:h-[60px] flex w-full items-center px-4 md:px-6 relative bg-background">
          <div className="text-lg font-semibold">{sale.title}</div>
        </div>
      </div>

      {/* content */}
      <div className="p-4 gap-4 md:p-6">
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          <div className="col-span-3 lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              <Card className="border rounded-md">
                <CardHeader className="border-b">
                  <div className="flex items-center">
                    <Badge className="rounded-md">
                      <Clock className="w-4 h-4 mr-1" />
                      Processing
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2">
                  {sale?.lineItems?.map((field: any) => (
                    <div
                      className="flex p-3 items-center border rounded-md"
                      key={field?.id}
                    >
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
                </CardContent>
                <CardFooter>
                  <Button className="flex w-full">Ship Now</Button>
                </CardFooter>
              </Card>

              {/* temporary */}

              <Card className="border rounded-md">
                <CardHeader className="border-b py-2">
                  <div className="flex items-center">
                    <Badge className="rounded-md">
                      <Truck className="w-4 h-4 mr-1" />
                      Processed
                    </Badge>
                    <div className="ml-auto mr-2">
                      Trackon Courier:
                      <a
                        href="https://goldysnestt.com"
                        target="_blank"
                        className="ml-1 text-primary underline"
                      >
                        657574536474
                      </a>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground"
                    >
                      <PenSquare className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground"
                    >
                      <Download className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2">
                  {sale?.lineItems?.map((field: any) => (
                    <div
                      className="flex p-3 items-center rounded-md border"
                      key={field?.id}
                    >
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
                </CardContent>
              </Card>

              {/* transations */}
              <Card className="rounded-md border overflow-hidden">
                <CardContent className="flex border-b">
                  {sale.totalDue !== 0 ? (
                    <>
                      <Badge className="rounded-md bg-error hover:bg-error text-white">
                        {sale.totalDue < 0 ? "Overpaid" : "Due"}
                      </Badge>

                      <div className="ml-auto">
                        {Numeral(Math.abs(sale.totalDue)).format()}
                      </div>
                    </>
                  ) : (
                    <Badge className="rounded-md bg-success hover:bg-scuuess text-white">
                      Paid
                    </Badge>
                  )}
                </CardContent>
                <CardContent>
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
                      <div className="ml-auto">
                        {Numeral(sale.total).format()}
                      </div>
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
                </CardContent>
              </Card>
            </div>
          </div>

          {/* column-2 */}
          <div className="col-span-3 lg:col-span-1">
            <div className="grid gap-4 md:gap-6">
              <Card className="border rounded-md">
                <CardContent>
                  <div className="flex justify-between mb-1">
                    <CardTitle className="text-base">Notes</CardTitle>
                    <PenSquare className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <CardDescription>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Doloremque, possimus!
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border rounded-md">
                <CardContent>
                  <div className="flex justify-between mb-1">
                    <CardTitle className="text-base">Customer</CardTitle>
                    <PenSquare className="w-4 h-4 text-muted-foreground" />
                  </div>

                  <CardDescription>
                    <div> {sale.shippingAddress?.name}</div>
                    <div> {sale.shippingAddress?.phone}</div>
                    <div> {sale.shippingAddress?.email}</div>
                  </CardDescription>
                </CardContent>
                <CardContent>
                  <div className="flex justify-between mb-1">
                    <CardTitle className="text-base">
                      Shipping Address
                    </CardTitle>
                    <PenSquare className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <CardDescription>
                    <div> {sale.shippingAddress?.name}</div>
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
                  </CardDescription>
                </CardContent>
                <CardContent>
                  <div className="flex justify-between mb-1">
                    <CardTitle className="text-base">Billing Address</CardTitle>
                    <PenSquare className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <CardDescription>
                    <div> {sale.shippingAddress?.name}</div>
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
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalePage;
