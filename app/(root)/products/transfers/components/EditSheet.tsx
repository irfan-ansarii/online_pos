"use client";
import React from "react";
import Image from "next/image";

import Numeral from "numeral";

import { useLocations } from "@/hooks/useUser";
import { Image as ImageIcon } from "lucide-react";

import {
  SheetHeader,
  SheetTitle,
  SheetContent,
  SheetFooter,
} from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type Option = Record<string, string>;

const EditSheet = ({ transfer }: { transfer: any }) => {
  const { data: locations, isLoading } = useLocations();

  const destination = React.useMemo(() => {
    if (isLoading) return {};
    return locations?.data?.data?.find((loc: any) => loc.id === transfer.toId);
  }, [locations]);
  console.log(destination);
  return (
    <SheetContent className="md:max-w-lg">
      <div className="flex flex-col h-full">
        <SheetHeader className="md:pb-2">
          <SheetTitle>Edit Transfer</SheetTitle>
        </SheetHeader>

        <div className="pb-4 space-y-4">
          <Select disabled defaultValue={`${destination.id}`}>
            <SelectTrigger>
              <SelectValue placeholder="Select Destination" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={`${destination.id}`}>
                {destination?.name}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative  grow max-h-full overflow-auto snap-y snap-mandatory space-y-2 scrollbox mb-4">
          {transfer.lineItems.map((field: any) => (
            <div
              className="flex rounded-md border p-2 pr-0 items-center snap-start"
              key={field.id}
            >
              <div className="flex gap-3 items-center col-span-2">
                <Avatar className="w-10 h-10 border-2">
                  <AvatarImage
                    asChild
                    src={`/${field.image.src}`}
                    className="object-cover"
                  >
                    <Image
                      src={`/${field.image.src}`}
                      alt={`/${field.image.src}`}
                      width={40}
                      height={40}
                    />
                  </AvatarImage>
                  <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
                    <ImageIcon className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5 truncate">
                  <div className="font-semibold truncate">{field.title}</div>
                  {field.variantTitle && (
                    <Badge className="py-.5" variant="secondary">
                      {field.variantTitle}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="ml-auto flex items-center">
                <div className="pr-6">{field.quantity}</div>
              </div>
            </div>
          ))}
        </div>
        <Separator className="h-0.5" />
        <SheetFooter className="pt-2 flex-col">
          <div className="flex">
            <div>Items</div>
            <div className="ml-auto">{transfer.totalItems}</div>
          </div>
          <div className="flex">
            <div>Amount</div>
            <div className="ml-auto">
              {Numeral(transfer.totalAmount).format()}
            </div>
          </div>
          <Button
            className="w-full"
            variant="destructive"
            disabled={transfer.status !== "pending"}
          >
            Cancel
          </Button>
        </SheetFooter>
      </div>
    </SheetContent>
  );
};

export default EditSheet;
