"use client";
import React from "react";

import { Sale } from "@prisma/client";

import { useSheetToggle } from "@/hooks/useSheet";

import { IndianRupee, Mail, MoreVertical, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PaymentDialog from "./PaymentDialog";

export default function SheetActions({
  payments,
  purchase,
  toggle,
}: {
  payments: any;
  purchase: Sale;
  toggle: () => void;
}) {
  const [newOpen, toggleNew] = useSheetToggle("new");

  // handle print invoice action
  const handlePrint = () => {
    console.log("handleprint");
  };

  // handle send invoice action
  const handleSendInvoice = () => {
    console.log("send invoice");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Printer className="w-4 h-4 mr-2" />
              Print Invoice
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="w-4 h-4 mr-2" />
              Send Invoice
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={toggleNew}
              disabled={purchase.totalDue === 0}
            >
              <IndianRupee className="w-4 h-4 mr-2" />

              {purchase.totalDue < 0 ? "Refund" : "Payment"}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* collect payment dialog */}
      {newOpen && <PaymentDialog purchase={purchase} payments={payments} />}
    </>
  );
}