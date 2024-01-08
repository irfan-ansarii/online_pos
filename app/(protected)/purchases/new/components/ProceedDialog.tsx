"use client";
import React, { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

import { PROCEED_PURCHASES_TABS } from "@/config/app";
import { useFormContext } from "react-hook-form";
import { useSheetToggle } from "@/hooks/useSheet";

const SupplierTab = lazy(() => import("./SupplierTab"));
const PaymentTab = lazy(() => import("./PaymentTab"));

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Tabs } from "@/components/ui/tabs";
import ReceiptTab from "./ReceiptTab";

const ProceedDialog = () => {
  const form = useFormContext();

  const [open, toggle] = useSheetToggle("new");

  const [active, setActive] = React.useState("supplier");

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
            {/* Supplier Tab */}
            <SupplierTab setActive={setActive} />

            <ReceiptTab setActive={setActive} />
            {/* Payment Tab */}
            <PaymentTab setActive={setActive} updateDue={updateDue} />
          </Suspense>

          {/* indicator */}
          <div className="flex gap-1 justify-center absolute bottom-20 inset-x-0">
            {PROCEED_PURCHASES_TABS.map((el) => (
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
