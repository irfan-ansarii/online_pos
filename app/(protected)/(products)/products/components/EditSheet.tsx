import React from "react";
import { MapPin, Settings2, Pencil } from "lucide-react";
import Numeral from "numeral";
import { useProduct } from "@/hooks/useProduct";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ErrorBox from "@/components/shared/error-box";
import Loading from "./Loading";

const EditSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" className="">
          <Pencil className="w-4 h-4" />
        </Button>
      </SheetTrigger>

      <SheetContent className="md:max-w-lg">
        <SheetHeader className="md:pb-2">
          <SheetTitle>{"title"}</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default EditSheet;
