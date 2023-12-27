"use client";
import React from "react";
import * as z from "zod";

import { updateCustomer } from "@/actions/customer-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerValidation } from "@/lib/validations/customer";

import { Loader2, PlusCircle, X } from "lucide-react";

import { useToggle } from "@uidotdev/usehooks";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AvatarItem } from "@/components/shared/avatar";
import { Badge } from "@/components/ui/badge";
import PaymentDialog from "./PaymentDialog";

const SaleSheet = ({
  children,
  sale,
}: {
  sale: any;
  children: React.ReactNode;
}) => {
  const [open, toggle] = useToggle(false);
  return (
    <Sheet open={open} onOpenChange={toggle}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="md:max-w-lg">
        <div className="flex flex-col h-full">
          <SheetHeader>
            <SheetTitle className="text-lg">{sale.title}</SheetTitle>
          </SheetHeader>
          <div className="relative  grow max-h-full overflow-auto snap-y snap-mandatory space-y-2 scrollbox mb-4">
            {sale.lineItems.map((field, i) => (
              <div
                className="flex rounded-md border p-2 pr-0 items-center snap-start"
                key={field?.id}
              >
                <AvatarItem src={`/${field?.product.image.src}`} />

                <div className="space-y-0.5 truncate flex-1 mx-3">
                  <div className="font-medium truncate">{field.title}</div>
                  <div className="flex w-full">
                    {field.variantTitle && (
                      <Badge className="py-0" variant="secondary">
                        {field.variantTitle}
                      </Badge>
                    )}
                    <div className="ml-auto text-muted-foreground">
                      1290 x 1
                    </div>
                  </div>
                </div>
                <div className="space-y-0.5 text-right">
                  <div className="line-through text-muted-foreground">1290</div>
                  <div className="font-medium">657.00</div>
                </div>
                <div className="flex items-center gap-6">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="opacity-50 hover:opacity-100 hover:bg-background transition"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t-2 py-2 border-dashed">
            <div className="flex justify-between py-1">
              <div>Subtotal</div>
              <div>550</div>
            </div>
            <div className="flex justify-between py-1">
              <div>Discount</div>
              <div>550</div>
            </div>
            <div className="flex justify-between py-1">
              <div>Tax</div>
              <div>550</div>
            </div>

            <div className="border-b-2 border-dashed my-2" />
            <div className="flex items-center py-1 text-lg font-medium">
              <div>Total</div>
              <div className="ml-auto">56756</div>
            </div>
            <div className="flex items-center p-2 mb-4 rounded-md bg-warning/20">
              <div>Due</div>
              <div className="ml-auto">56756</div>
            </div>

            <PaymentDialog />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SaleSheet;
