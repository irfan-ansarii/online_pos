"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Search, ScanLine } from "lucide-react";
import ProductCard from "./ProductCard";
import Scanner from "./Scanner";
const Products = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center h-[61px] border-b sticky top-0 z-50 bg-background mb-4">
          <div className="relative grow">
            <Input
              type="text"
              className="bg-transparent rounded-none border-none pl-10 focus-visible:ring-transparent"
              placeholder="Search..."
            />
            <span className="absolute left-0 inset-y-0 h-full flex items-center justify-center w-10 text-muted-foreground">
              <Search className="w-5 h-5" />
            </span>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 w-10 inset-y-0 h-full flex items-center justify-center text-muted-foreground"
              >
                <ScanLine className="w-5 h-5" />
              </Button>
            </DialogTrigger>
          </div>
        </div>
        <DialogContent className="p-0 overflow-hidden max-h-md bottom-auto top-6">
          <Scanner open={open} setOpen={setOpen} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-2 sm:grid-cols-3  md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {[...Array(20)].map((el, i) => (
          <ProductCard />
        ))}
      </div>
    </>
  );
};

export default Products;
