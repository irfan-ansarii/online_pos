"use client";
import React, { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

import { PROCEED_PURCHASES_TABS } from "@/config/app";
import { useFormContext } from "react-hook-form";
import { useSheetToggle } from "@/hooks/useSheet";

const SupplierTab = lazy(() => import("../../new/components/SupplierTab"));
const PaymentTab = lazy(() => import("./PaymentTab"));
const ReceiptTab = lazy(() => import("../../new/components/ReceiptTab"));

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Tabs } from "@/components/ui/tabs";

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
    const paid = form.getValues("totalPaid");
    const refund = form.getValues("totalRefund");

    const received = transactions?.reduce((acc: any, curr: any) => {
      acc += Math.abs(curr.amount || 0);
      return acc;
    }, 0);

    const dueAmount = total + Number(refund) - paid;

    if (dueAmount < 0) {
      form.setValue("transactionKind", "refund");
    } else {
      form.setValue("transactionKind", "purchase");
    }

    form.setValue(
      "totalDue",
      received > Math.abs(dueAmount)
        ? dueAmount
        : dueAmount + (dueAmount < 0 ? received : -received)
    );
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
