"use client";
import React from "react";
import Link from "next/link";
import { Payment, Sale } from "@prisma/client";
import { generateSaleInvoice } from "@/actions/labels/generate-sale-invoice";

import { useSheetToggle } from "@/hooks/useSheet";
import { toast } from "@/components/ui/use-toast";
import { Download, IndianRupee, Loader2, Mail, PenSquare } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import PaymentDialog from "./payment-dialog";

const Actions = ({ sale, payments }: { sale: Sale; payments: Payment[] }) => {
  const [newOpen, toggleNew] = useSheetToggle("new");
  const [printing, setPrinting] = React.useState(false);

  const handlePrint = async () => {
    try {
      setPrinting(true);

      const res = await generateSaleInvoice(sale.id);
      if (window) window.open(res, "_blank");
    } catch (error) {
      toast({
        title: "Something went wrong!",
        variant: "error",
      });
    } finally {
      setPrinting(false);
    }
  };

  // handle send invoice action
  const handleSendInvoice = () => {
    console.log("send invoice");
  };

  return (
    <div className="relative border-b bg-background">
      <div className="h-[50px] md:h-[60px] flex w-full items-center px-4 md:px-6 relative bg-background">
        <div className="text-lg font-semibold hidden md:block">
          {sale.title}
        </div>

        <div className="flex items-center justify-end ml-auto">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href={`/sales/${sale.id}/edit`}
                className={buttonVariants({ variant: "ghost", size: "icon" })}
              >
                <PenSquare className="w-4 h-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                onClick={handlePrint}
                variant="ghost"
                size="icon"
                disabled={printing}
              >
                {printing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download Invoice</TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Mail className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send Invoice</TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                onClick={toggleNew}
                disabled={sale.totalDue === 0}
                variant="ghost"
                size="icon"
              >
                <IndianRupee className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {sale.totalDue < 0 ? "Refund" : "Collect Payment"}
            </TooltipContent>
          </Tooltip>

          {/* collect payment dialog */}
          {newOpen && <PaymentDialog sale={sale} payments={payments} />}
        </div>
      </div>
    </div>
  );
};

export default Actions;
