"use client";
import React from "react";
import Numeral from "numeral";
import { deleteUser } from "@/actions/user-actions";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
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

const contactCard = ({ contact, progress }: any) => {
  const [open, toggle] = useToggle();
  const [loading, toggleLoading] = useToggle();
  const router = useRouter();

  const progressClassName =
    progress < 0 ? "bg-error" : progress > 50 ? "bg-success" : "bg-info";

  const badgeClassName =
    contact.status === "active"
      ? "bg-success hover:bg-success"
      : "bg-error hover:bg-error";

  /** handle delete  */
  const onDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      toggleLoading(true);
      await deleteUser(contact.id);
      toast({
        variant: "success",
        title: "Contact deleted",
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
    router.push(`/contacts/${contact.id}`);
  };

  return (
    <Card className="hover:bg-accent group relative">
      <CardContent
        className="grid grid-cols-9 gap-3 items-center relative cursor-pointer"
        onClick={onClick}
      >
        <div className="col-span-2 space-y-0.5">
          <div className="truncate font-medium text-base">
            {contact.firstName}
          </div>
          {contact.addresses?.length > 0 ? (
            <div className="text-muted-foreground text-xs inline-flex gap-1 items-center">
              <MapPin className="w-3 h-3" />
              <span className="capitalize">
                {contact.addresses?.[0]?.state}
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground capitalize">
              {contact.role}
            </span>
          )}
        </div>
        <div className="col-span-3">
          <div className="text-muted-foreground">{contact.phone}</div>
          <div className="text-muted-foreground">{contact.email}</div>
        </div>

        <div className="col-span-2 text-right overflow-hidden">
          <div className="flex justify-between text-xs font-medium uppercase mb-2">
            <div>{contact.role === "supplier" ? "Purchase" : "Sale"}</div>
            <div>{Numeral(contact._sum).format()}</div>
          </div>
          <div className="w-full rounded-full h-3 bg-secondary overflow-hidden relative">
            {/* <span className="text-[10px] absolute left-2 top-[-4px] font-medium">
              {Numeral(progress / 100).format("0%")}
            </span> */}
            <div
              className={`bg-blue-600 h-3 rounded-full ${progressClassName}`}
              style={{ width: `${Math.abs(progress)}%` }}
            ></div>
          </div>
        </div>

        <div className="col-span-2 text-right overflow-hidden">
          <Badge
            className={`rounded-md capitalize truncate ${badgeClassName}`}
            variant="secondary"
          >
            {contact.status}
          </Badge>
        </div>
      </CardContent>

      {/* actions */}
      <div className="absolute inset-y-0 right-0 px-4 invisible group-hover:visible bg-accent flex items-center gap-2">
        <EditSheet contact={contact} />

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
                This action will permanently remove the selected contact from
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

export default contactCard;
