"use client";
import React, { lazy, Suspense } from "react";
import { Check, Loader2 } from "lucide-react";

import { useFormContext } from "react-hook-form";
import { useSheetToggle } from "@/hooks/useSheet";

const EmployeeTab = lazy(() => import("./EmployeeTab"));
const CustomerTab = lazy(() => import("./CustomerTab"));
const PaymentTab = lazy(() => import("./PaymentTab"));

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { PROCEED_SALE_TABS } from "@/config/app";
import { INVOICE_OPTIONS } from "@/config/app";

const ProceedDialog = () => {
  const form = useFormContext();

  const [open, toggle] = useSheetToggle("new");

  const [active, setActive] = React.useState("employee");

  /**
   * update due amount
   */
  const updateDue = () => {
    const total = form.getValues("total");
    const transactions = form.getValues("transactions");

    const received = transactions?.reduce((acc: any, curr: any) => {
      acc += Math.abs(curr.amount || 0);
      return acc;
    }, 0);
    form.setValue("totalDue", Math.abs(total) - received);
  };

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent className="focus-visible:ring-transparent">
        <Tabs value={active} onValueChange={setActive}>
          <Suspense
            fallback={
              <div className="flex flex-col h-[32rem] bg-background relative z-50 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            }
          >
            {/* Employee Tab */}
            <EmployeeTab setActive={setActive} />

            {/* Customer Tab */}
            <CustomerTab setActive={setActive} />

            {/* Payment Tab */}
            <PaymentTab setActive={setActive} updateDue={updateDue} />
          </Suspense>

          {/* sale created tab */}
          <TabsContent
            value="completed"
            className="mt-0 focus-visible:ring-transparent"
          >
            <div className="flex flex-col h-[32rem]">
              <DialogHeader className="text-left pb-6">
                <DialogTitle>Receipt</DialogTitle>
                <DialogDescription>
                  Select the option bellow to send or print invoice
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto scrollbox">
                <RadioGroup defaultValue="card" className="flex flex-col">
                  {INVOICE_OPTIONS.map((el) => {
                    const Icon = el.icon;
                    return (
                      <div key={el.key} className="relative">
                        <RadioGroupItem
                          value={el.name}
                          id={`${el.key}`}
                          className="peer sr-only"
                        />
                        <div className="absolute w-5 h-5 bg-primary top-1/2 -translate-y-1/2 right-3 rounded-full inline-flex items-center justify-center opacity-0 peer-data-[state=checked]:opacity-100">
                          <Check className="w-3 h-3" />
                        </div>
                        <Label
                          htmlFor={`${el.key}`}
                          className="flex gap-3 px-3 py-2 rounded-md border items-center cursor-pointer hover:bg-accent transition duration-300 peer-data-[state=checked]:bg-accent"
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>
                              <Icon className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="truncate w-full text-left mb-1">
                              {el.name}
                            </div>
                            <div className="text-muted-foreground font-normal text-xs">
                              Lorem ipsum dolor sit amet, consectetur
                              adipisicing elit.
                            </div>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              <Button className="w-full mt-10" type="button">
                Send Invoice
              </Button>
            </div>
          </TabsContent>

          {/* indicator */}
          <div className="flex gap-1 justify-center absolute bottom-20 inset-x-0">
            {PROCEED_SALE_TABS.map((el) => (
              <div
                key={el}
                className={`py-0 block h-2 rounded-full ${
                  active === el ? "bg-primary w-10" : "bg-secondary w-6"
                }`}
              />
            ))}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProceedDialog;
