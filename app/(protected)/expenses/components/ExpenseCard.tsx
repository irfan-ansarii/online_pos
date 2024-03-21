"use client";
import React from "react";
import format from "date-fns/format";
import { Expense } from "@prisma/client";
import Numeral from "numeral";
import { Loader2, PenSquare, Trash2 } from "lucide-react";

import { deleteExpense } from "@/actions/expense-actions";

import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useToggle } from "@uidotdev/usehooks";

import { Card, CardContent } from "@/components/ui/card";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import ExpenseDialog from "./ExpenseDialog";

const ExpenseCard = ({ expense }: { expense: Expense }) => {
  const [openDelete, toggleDelete] = useToggle();
  const [loading, setLoading] = useToggle(false);
  const router = useRouter();
  // handle delete purchase action
  const onDelete = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteExpense(expense.id);
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
    <Card className="hover:bg-accent group relative cursor-pointer overflow-hidden">
      <CardContent className="grid grid-cols-5 gap-3 items-center">
        <div className="flex gap-3 col-span-3 md:col-span-4">
          <div className="border-r pr-4 text-center shrink-0">
            <div className="text-lg leading-tight font-semibold">
              {format(new Date(expense.createdAt), "dd")}
            </div>
            <div className="leading-tight text-xs text-muted-foreground">
              {format(new Date(expense.createdAt), "MMM yy")}
            </div>
          </div>
          <div className="space-y-0.5 truncate">
            <div className="font-medium">{expense.name}</div>
            <Popover>
              <PopoverTrigger asChild>
                <div className="text-muted-foreground max-w-2/3 truncate">
                  {expense.notes}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-44">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Perspiciatis animi cupiditate, quibusdam sed fugit perferendis
                exercitationem, tempora architecto sapiente beatae veniam?
                Deserunt inventore a officiis incidunt sequi, reiciendis amet
                est.
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1 text-right space-y-0.5 flex justify-between">
          <div className={`font-semibold`}>
            {Numeral(expense.amount).format()}
          </div>
          <Badge variant="secondary" className="rounded-md">
            {expense.category}
          </Badge>
        </div>
      </CardContent>

      <div className="absolute inset-y-0 right-0 px-4 invisible group-hover:visible bg-accent flex items-center gap-2">
        <ExpenseDialog
          defaultValues={{
            id: expense.id,
            name: expense.name,
            category: expense.category,
            amount: expense.amount,
            notes: expense.notes,
            createdAt: new Date(expense.createdAt).toISOString(),
          }}
        >
          <Button variant="secondary" size="icon">
            <PenSquare className="w-4 h-4" />
          </Button>
        </ExpenseDialog>

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
                This action will permanently remove the selected record and
                cannot be undone.
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

export default ExpenseCard;
