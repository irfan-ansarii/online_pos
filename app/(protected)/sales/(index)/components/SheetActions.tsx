"use client";
import React from "react";
import Link from "next/link";
import { Payment, Sale } from "@prisma/client";

import { useSheetToggle } from "@/hooks/useSheet";

import {
  IndianRupee,
  Mail,
  MoreVertical,
  PenSquare,
  Printer,
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
  sale,
  payments,
  toggle,
}: {
  sale: Sale;
  payments: Payment[];
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
              <Link href={`/sales/${sale.id}`} className="flex-1 inline-flex">
                <PenSquare className="w-4 h-4 mr-2 " />
                Edit
              </Link>
            </DropdownMenuItem>
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
              disabled={sale.totalDue === 0}
            >
              <IndianRupee className="w-4 h-4 mr-2" />

              {sale.totalDue < 0 ? "Refund" : "Collect Payment"}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* collect payment dialog */}
      {newOpen && <PaymentDialog sale={sale} payments={payments} />}
    </>
  );
}
