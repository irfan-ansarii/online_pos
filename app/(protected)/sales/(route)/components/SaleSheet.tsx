"use client";
import React from "react";
import * as z from "zod";

import { updateCustomer } from "@/actions/customer-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerValidation } from "@/lib/validations/customer";

import { Loader2, PlusCircle } from "lucide-react";

import { useToggle } from "@uidotdev/usehooks";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const SaleSheet = ({
  children,
  sale,
}: {
  sale: any;
  children: React.ReactNode;
}) => {
  const [open, toggle] = useToggle(false);
  return (
    <Sheet open={open} onOpenChange={toggle}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="md:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-lg">{sale.title}</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default SaleSheet;
