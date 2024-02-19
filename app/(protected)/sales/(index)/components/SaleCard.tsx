"use client";
import React from "react";
import { Payment } from "@prisma/client";
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
import { Button, buttonVariants } from "@/components/ui/button";

const SaleCard = ({ sale, payments }: { sale: any; payments: Payment[] }) => {
  const [openDelete, toggleDelete] = useToggle();
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  const status: { [key: string]: any } = {
    pending: {
      className: "bg-warning hover:bg-warning",
      text: "due",
    },
    paid: {
      className: "bg-success hover:bg-success",
      text: "paid",
    },
    partialy_paid: {
      className: "bg-info hover:bg-info",
      text: "Partial",
    },
    partialy_refunded: {
      className: "bg-info hover:bg-info",
      text: "Partial",
    },
    refunded: {
      className: "bg-destructive hover:bg-destructive",
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
      <CardContent
        className="grid grid-cols-8 gap-3 items-center"
        onClick={() => router.push(`/sales/${sale.id}`)}
      >
        <div className="flex gap-3 col-span-4 md:col-span-3">
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

        <div
          className={`grid ${
            sale.shippingStatus ? "grid-cols-3 md:grid-cols-4" : "grid-cols-3"
          } col-span-4 md:col-span-5  items-center`}
        >
          <div className="block  space-y-0.5">
            <div className="font-medium uppercase">{sale.title}</div>
            <span className="text-muted-foreground">
              {sale?.employee?.firstName}
            </span>
          </div>

          <div className="hidden md:block space-y-0.5">
            <div className="font-medium">{sale?.customer?.firstName}</div>
            <div className="text-muted-foreground">{sale?.customer?.phone}</div>
          </div>

          {sale.shippingStatus && (
            <div className="text-right space-y-0.5 hidden md:block">
              <div className="text-xs text-muted-foreground">12-05-2023</div>
              <Badge
                variant="secondary"
                className={cn(
                  `rounded-md capitalize w-20 justify-center truncate bg-success text-white`
                )}
              >
                {sale.shippingStatus}
              </Badge>
            </div>
          )}
          <div className="space-y-0.5 col-span-2 md:col-span-1 text-right">
            <div className={`font-semibold`}>
              {Numeral(sale.total).format()}
            </div>
            <Badge
              variant="secondary"
              className={cn(
                `rounded-md capitalize justify-center truncate text-white`,
                status[sale.status].className
              )}
            >
              {status[sale.status].text}
            </Badge>
          </div>
        </div>
      </CardContent>

      <div className="absolute inset-y-0 right-0 px-4 invisible group-hover:visible bg-accent flex items-center gap-2">
        <Link
          href={`/sales/${sale.id}/edit`}
          className={buttonVariants({ variant: "secondary", size: "icon" })}
        >
          <PenSquare className="w-4 h-4" />
        </Link>

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
                className="min-w-[6rem] bg-destructive text-destructive-foreground hover:bg-destructive/80"
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
