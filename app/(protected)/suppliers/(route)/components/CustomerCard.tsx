"use client";
import React from "react";
import Link from "next/link";
import Numeral from "numeral";
import { deleteUser } from "@/actions/user-actions";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";

import EditSheet from "./EditSheet";
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

import { useToggle } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";

const CustomerCard = ({ customer }: any) => {
  const [open, toggle] = useToggle();
  const [loading, toggleLoading] = useToggle();
  const router = useRouter();
  const getBadgeClass = (amount: number) => {
    if (amount > 50000) return "bg-success hover:bg-success";
    if (amount > 25000) return "bg-info hover:bg-info";
    if (amount > 10000) return "bg-warning hover:bg-warning";

    return "bg-destructive hover:bg-destructive";
  };
  const onDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      toggleLoading(true);
      await deleteUser(customer.id);
      toast({
        variant: "success",
        title: "Customer deleted",
      });
    } catch (error: any) {
      toast({
        variant: "error",
        title: error.message || "Something went wrong",
      });
    } finally {
      toggleLoading();
      toggle();
    }
  };

  const onClick = () => {
    router.push(`/customers/${customer.id}`);
  };
  return (
    <Card className="hover:bg-accent group relative">
      <CardContent
        className="grid grid-cols-7 gap-3 items-center relative cursor-pointer"
        onClick={onClick}
      >
        <div className="flex gap-2 items-center col-span-4 md:col-span-3">
          <Avatar className="border-2 shrink-0">
            <AvatarFallback className="">
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <div className="truncate font-medium">{customer.firstName}</div>
            {customer.addresses?.length > 0 ? (
              <div className="text-muted-foreground text-xs inline-flex gap-1 items-center">
                <MapPin className="w-3 h-3" />
                <span className="capitalize">
                  {customer.addresses?.[0]?.state}
                </span>
              </div>
            ) : null}
          </div>
        </div>
        <div className="col-span-2">
          <div className="text-muted-foreground">{customer.phone}</div>
          <div className="text-muted-foreground">{customer.email}</div>
        </div>

        <div className="col-span-2 text-right overflow-hidden">
          <div className="font-medium">
            {Numeral(customer.orders._sum.total).format()}
          </div>

          <Badge
            className={`rounded-md uppercase truncate text-white w-24 ${getBadgeClass(
              customer.orders._sum.total
            )}`}
            variant="secondary"
          >
            <span>Orders</span>
            <span className="mx-1 opacity-40">|</span>
            <span className="ml-auto">{customer.orders._count.total}</span>
          </Badge>
        </div>
      </CardContent>

      <div className="absolute inset-y-0 right-0 px-4 invisible group-hover:visible bg-accent flex items-center gap-2">
        <EditSheet customer={customer} />

        <AlertDialog open={open} onOpenChange={toggle}>
          <AlertDialogTrigger asChild>
            <Button variant="secondary" size="icon" className="">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently remove the selected customer from
                the system and cannot be undone.
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

export default CustomerCard;
