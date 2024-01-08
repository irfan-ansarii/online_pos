"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import format from "date-fns/format";
import Numeral from "numeral";

import { deleteSale } from "@/actions/sale-actions";

import { useRouter } from "next/navigation";
import { useToggle } from "@uidotdev/usehooks";
import { toast } from "@/components/ui/use-toast";

import { Loader2, Trash2, PenSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarGroup, AvatarItem } from "@/components/shared/avatar";

import SaleSheet from "./SaleSheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const SaleCard = ({ sale }: { sale: any }) => {
  const [openDelete, toggleDelete] = useToggle();
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();
  const status: { [key: string]: any } = {
    pending: {
      className: "bg-warning hover:bg-warning text-white",
      text: "Pending",
    },
    paid: {
      className: "bg-success hover:bg-success text-white",
      text: "Paid",
    },
    partialy_paid: {
      className: "bg-info hover:bg-info text-white",
      text: "Partial",
    },
    partialy_refunded: {
      className: "bg-destructive hover:bg-destructive text-white",
      text: "Partial",
    },
    refunded: {
      className: "bg-destructive hover:bg-destructive text-white",
      text: "Refunded",
    },
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

      toggleDelete();
      router.refresh();
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
    <Card className="hover:bg-accent group relative cursor-pointer">
      <SaleSheet sale={sale}>
        <CardContent className="grid grid-cols-8 gap-3 items-center">
          <div className="flex gap-3 col-span-4">
            <div className="border-r pr-4 text-center shrink-0">
              <div className="text-lg leading-tight font-semibold">
                {format(sale.createdAt, "dd")}
              </div>
              <div className="leading-tight text-xs text-muted-foreground">
                {format(sale.createdAt, "MMM yy")}
              </div>
            </div>

            <div className="flex -space-x-2 truncate">
              <AvatarGroup maxCount={2}>
                {sale?.lineItems?.map((lineItem: any) => (
                  <AvatarItem
                    key={lineItem.id}
                    src={lineItem?.product?.image?.src}
                  />
                ))}
              </AvatarGroup>
            </div>
          </div>

          <div className="block col-span-2 space-y-0.5">
            <div className="font-medium uppercase">{sale.title}</div>
            <span className="text-muted-foreground">
              {sale?.employee?.firstName}
            </span>
          </div>

          <div className="hidden md:flex flex-col space-y-0.5">
            <div className="font-medium">{sale?.customer?.firstName}</div>
            <div className="text-muted-foreground">{sale?.customer?.phone}</div>
          </div>
          <div className="col-span-2 md:col-span-1 space-y-0.5  text-right">
            <div className={sale.total < 0 ? "text-error" : ""}>
              {Numeral(sale.total).format()}
            </div>
            <Badge
              variant="secondary"
              className={cn(
                `rounded-md uppercase`,
                status[sale.status].className
              )}
            >
              {status[sale.status].text}
            </Badge>
          </div>
        </CardContent>
      </SaleSheet>

      <div className="absolute inset-y-0 right-0 px-4 invisible group-hover:visible bg-accent flex items-center gap-2">
        <Button variant="secondary" size="icon">
          <Link href={`/sales/${sale.id}`}>
            <PenSquare className="w-4 h-4" />
          </Link>
        </Button>

        {/* delete alert */}
        <AlertDialog open={openDelete} onOpenChange={toggleDelete}>
          <AlertDialogTrigger asChild>
            <Button variant="secondary" size="icon">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
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
      </div>
    </Card>
  );
};

export default SaleCard;
