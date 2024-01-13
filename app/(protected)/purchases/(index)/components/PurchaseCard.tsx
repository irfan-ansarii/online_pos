"use client";
import React from "react";
import Link from "next/link";
import format from "date-fns/format";
import Numeral from "numeral";
import { Loader2, PenSquare, Trash2 } from "lucide-react";

import { deletePurchase } from "@/actions/purchase-actions";

import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useToggle } from "@uidotdev/usehooks";

import { Card, CardContent } from "@/components/ui/card";
import { AvatarGroup, AvatarItem } from "@/components/shared/avatar";

import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

import PurchaseSheet from "./PurchaseSheet";

const PurchaseCard = ({ purchase }: { purchase: any }) => {
  const [openDelete, toggleDelete] = useToggle();
  const [loading, setLoading] = useToggle(false);

  const router = useRouter();

  const status: { [key: string]: any } = {
    pending: {
      className: "bg-warning hover:bg-warning text-white",
      text: "due",
    },
    paid: {
      className: "bg-success hover:bg-success text-white",
      text: "paid",
    },
    partialy_paid: {
      className: "bg-info hover:bg-info text-white",
      text: "Partial",
    },
    partialy_refunded: {
      className: "bg-info hover:bg-info text-white",
      text: "Partial",
    },
    refunded: {
      className: "bg-destructive hover:bg-destructive text-white",
      text: "Refunded",
    },
  };

  // handle delete purchase action
  const onDelete = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deletePurchase(purchase.id);
      toast({
        variant: "success",
        title: "Purchase deleted successfully",
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
      <PurchaseSheet purchase={purchase}>
        <CardContent className="grid grid-cols-8 gap-3 items-center">
          <div className="flex gap-3 col-span-4">
            <div className="border-r pr-4 text-center shrink-0">
              <div className="text-lg leading-tight font-semibold">
                {format(new Date(), "dd")}
              </div>
              <div className="leading-tight text-xs text-muted-foreground">
                {format(purchase.createdAt, "MMM yy")}
              </div>
            </div>

            <div className="flex -space-x-2 truncate">
              <AvatarGroup maxCount={4}>
                {purchase?.lineItems?.map((lineItem: any) => (
                  <AvatarItem
                    key={lineItem.id}
                    src={lineItem?.product?.image?.src}
                  />
                ))}
              </AvatarGroup>
            </div>
          </div>

          <div className="block col-span-2 space-y-0.5">
            <div className="font-medium uppercase">{purchase.title}</div>
          </div>

          <div className="hidden md:flex flex-col space-y-0.5">
            <div className="font-medium">{purchase.supplier?.firstName}</div>
            <div className="text-muted-foreground">
              {purchase.supplier?.phone}
            </div>
          </div>
          <div className="col-span-2 md:col-span-1 space-y-0.5  text-right">
            <div className={`font-semibold`}>
              {Numeral(purchase.total).format()}
            </div>
            <Badge
              variant="secondary"
              className={`rounded-md uppercase w-20 justify-center truncate ${
                status[purchase.status].className
              }`}
            >
              {[status[purchase.status].text]}
            </Badge>
          </div>
        </CardContent>
      </PurchaseSheet>

      <div className="absolute inset-y-0 right-0 px-4 invisible group-hover:visible bg-accent flex items-center gap-2">
        <Link
          href={`/purchases/${purchase.id}`}
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

export default PurchaseCard;
