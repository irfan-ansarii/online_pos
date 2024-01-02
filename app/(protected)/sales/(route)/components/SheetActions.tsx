"use client";
import React from "react";
import Link from "next/link";
import { Sale } from "@prisma/client";

import { deleteSale } from "@/actions/sale-actions";

import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useSheetToggle } from "@/hooks/useSheet";

import {
  IndianRupee,
  Loader2,
  Mail,
  MoreVertical,
  PenSquare,
  Printer,
  Trash2,
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import PaymentDialog from "./PaymentDialog";

export default function SheetActions({
  sale,
  toggle,
}: {
  sale: Sale;
  toggle: () => void;
}) {
  const [newOpen, toggleNew] = useSheetToggle("new");
  const [deleteOpen, toggleDelete] = useSheetToggle("delete");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  // handle print invoice action
  const handlePrint = () => {
    console.log("handleprint");
  };

  // handle send invoice action
  const handleSendInvoice = () => {
    console.log("send invoice");
  };

  // handle delete sale action
  const onDelete = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteSale(sale.id);
      toast({
        variant: "success",
        title: "Sale deleted successfully",
      });

      // hide delete dialog
      toggleDelete();
      // refresh route
      router.refresh();
      // hide sheet
      toggle();
    } catch (error: any) {
      toast({
        variant: "error",
        title: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="mr-2">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={`/sales/${sale.id}`}>
                <PenSquare className="w-4 h-4 mr-2" />
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
            <DropdownMenuItem
              onSelect={toggleNew}
              disabled={sale.totalDue <= 0}
            >
              <IndianRupee className="w-4 h-4 mr-2" />
              Collect Payment
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-error" onSelect={toggleDelete}>
              <Trash2 className="w-4 h-4 mr-2 " />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* collect payment dialog */}
      {newOpen && <PaymentDialog sale={sale} />}

      {/* delete alert */}
      <AlertDialog open={deleteOpen} onOpenChange={toggleDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently remove the sale and restock the
              products from the system and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="w-28 bg-destructive text-destructive-foreground hover:bg-destructive/80"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
