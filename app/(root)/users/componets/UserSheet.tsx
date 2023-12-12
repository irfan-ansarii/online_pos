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

const UserSheet = ({ children, user }) => {
  console.log(user);
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className="md:max-w-lg">
        <SheetHeader className="md:pb-2">
          <SheetTitle>{user.firstName}</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default UserSheet;
