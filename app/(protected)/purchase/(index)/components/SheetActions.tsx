"use client";
import React from "react";
import Link from "next/link";
import { Sale } from "@prisma/client";
import { getPurchaseInvoice } from "@/actions/labels/get-purchase-invoice";
import { useSheetToggle } from "@/hooks/useSheet";

import {
  Download,
  IndianRupee,
  Mail,
  MoreVertical,
  PenSquare,
} from "lucide-react";
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

  const handleClick = async () => {
    const response = await getPurchaseInvoice(purchase.id);
    window.open(response, "_blank");
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
              <Link
                href={`/purchase/${purchase.id}`}
                className="flex-1 inline-flex"
              >
                <PenSquare className="w-4 h-4 mr-2 " />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleClick}>
              <Download className="w-4 h-4 mr-2" />
              Download
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
