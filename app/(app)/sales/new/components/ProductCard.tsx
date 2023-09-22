import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Plus, Search, ScanLine } from "lucide-react";
import CartDrawer from "./CartDrawer";

const ProductCard = () => {
  return (
    <>
      <CartDrawer />

      <div className="hidden md:flex items-center h-[60px] border-b sticky top-0 z-50 bg-background mb-4">
        <div className="relative grow">
          <Input
            type="text"
            className="bg-transparent rounded-none border-none pl-10 focus-visible:ring-transparent"
            placeholder="Search..."
          />
          <span className="absolute left-0 inset-y-0 h-full flex items-center justify-center w-10 text-muted-foreground">
            <Search className="w-5 h-5" />
          </span>
          <span className="absolute right-0 inset-y-0 h-full flex items-center justify-center text-muted-foreground">
            <ScanLine className="w-5 h-5" />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3  md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {[...Array(20)].map(() => (
          <div className="rounded border">
            <div>
              <Avatar className="w-full h-full rounded-t rounded-b-none">
                <AvatarImage
                  alt="@shadcn"
                  className="object-cover object-cover"
                />
                <AvatarFallback className="object-cover object-cover aspect-square rounded-t rounded-b-none">
                  CN
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="p-2">
              <div className="truncate text-sm">Title 86rtfkhgtydgfhfhgy</div>
              <div className="text-sm text-muted-foreground">Price</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductCard;
