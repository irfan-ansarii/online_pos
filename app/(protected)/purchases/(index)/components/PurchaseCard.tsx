"use client";
import React from "react";
import Link from "next/link";
import format from "date-fns/format";
import Numeral from "numeral";
import { cn } from "@/lib/utils";
import { Loader2, PenSquare, Trash2, User } from "lucide-react";

import { useToggle } from "@uidotdev/usehooks";

import { Card, CardContent } from "@/components/ui/card";
import { AvatarGroup, AvatarItem } from "@/components/shared/avatar";

import { Button } from "@/components/ui/button";
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

const PurchaseCard = ({ purchase }) => {
  const [openDelete, toggleDelete] = useToggle();
  const [loading, setLoading] = useToggle(false);
  const onDelete = () => {
    console.log("delete");
  };
  return (
    <Card className="hover:bg-accent group relative cursor-pointer">
      <PurchaseSheet purchase={{}}>
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
                {[...Array(10)].map((lineItem: any, i) => (
                  <AvatarItem key={i} src={lineItem?.product?.image?.src} />
                ))}
              </AvatarGroup>
            </div>
          </div>

          <div className="block col-span-2 space-y-0.5">
            <div className="font-medium uppercase">GN1235656</div>
          </div>

          <div className="hidden md:flex flex-col space-y-0.5">
            <div className="font-medium">Supplier</div>
            <div className="text-muted-foreground">Supplier Phone</div>
          </div>
          <div className="col-span-2 md:col-span-1 space-y-0.5  text-right">
            <div>{Numeral(540).format()}</div>
            <Badge variant="secondary" className={`rounded-md uppercase`}>
              status
            </Badge>
          </div>
        </CardContent>
      </PurchaseSheet>

      <div className="absolute inset-y-0 right-0 px-4 invisible group-hover:visible bg-accent flex items-center gap-2">
        <Button variant="secondary" size="icon">
          <Link href={`/sales/123`}>
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

export default PurchaseCard;
