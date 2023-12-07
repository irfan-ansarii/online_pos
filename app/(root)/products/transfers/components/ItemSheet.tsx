import React, { useState, useMemo, ChangeEvent } from "react";
import Image from "next/image";
import { Image as ImageIcon, Check, X } from "lucide-react";

import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface LineItem {
  id: number;
  title: string;
  variantTitle?: string;
  image?: ImageType;
  quantity: number;
}
interface ImageType {
  id: number;
  title: string;
  src: string;
}

interface Transfer {
  id: number;
  lineItems: LineItem[];
  source: Source;
}

interface Source {
  name: string;
  type: string;
}

interface ProductSheetProps {
  transfer: Transfer;
}

const ProductSheet: React.FC<ProductSheetProps> = ({ transfer }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [accepted, setAccepted] = useState<number[]>([]);

  // filtered list items
  const filteredList = useMemo<LineItem[]>(() => {
    if (!searchTerm) {
      return transfer.lineItems;
    }

    const lowercasedSearchTerm = searchTerm.toLowerCase();

    return transfer.lineItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lowercasedSearchTerm) ||
        (item.variantTitle &&
          item.variantTitle.toLowerCase().includes(lowercasedSearchTerm))
    );
  }, [searchTerm, transfer.lineItems]);

  // handle search
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // handle item click
  const handleClick = (itemId: number) => {
    const index = accepted.indexOf(itemId);
    if (index === -1) {
      setAccepted([...accepted, itemId]);
      return;
    }

    accepted.splice(index, 1);
    setAccepted([...accepted]);
  };

  return (
    <SheetContent className="md:max-w-lg">
      <div className="flex flex-col h-full gap-4">
        <SheetHeader className="md:pb-2">
          <SheetTitle>Transfer</SheetTitle>
        </SheetHeader>

        <Badge
          variant="secondary"
          className="block rounded-md p-3 capitalize text-sm bg-secondary/80"
        >
          <div>{transfer.source.name}</div>
          <div className="text-xs font-normal text-muted-foreground">
            {transfer.source.type}
          </div>
        </Badge>
        <div className="mb-">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="relative -mx-6 px-6 -my-3 py-3 grow max-h-full overflow-auto snap-y snap-mandatory space-y-3 scrollbox mb-4">
          {filteredList.length == 0 && (
            <div className="text-center">No result found.</div>
          )}
          {filteredList?.map((item, i) => (
            <div
              className={`flex relative rounded-md border p-2 pr-0 items-center snap-stat cursor-pointer `}
              key={i}
              onClick={() => handleClick(item.id)}
            >
              <div className="flex gap-3 items-center col-span-2">
                <Avatar className="w-10 h-10 border-2">
                  <AvatarImage
                    asChild
                    src={`/${item?.image?.src}`}
                    className="object-cover"
                  >
                    <Image
                      src={`/${item?.image?.src}`}
                      alt={`/${item?.image?.title}`}
                      width={40}
                      height={40}
                    />
                  </AvatarImage>
                  <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
                    <ImageIcon className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-0.5 truncate">
                  <div className="font-semibold truncate">{item?.title}</div>
                  {item?.variantTitle && (
                    <Badge className="py-.5" variant="secondary">
                      {item?.variantTitle}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="ml-auto flex gap-4 items-center">
                {item?.quantity}

                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-background transition"
                >
                  {accepted.indexOf(item.id) !== -1 ? (
                    <X className="w-4 h-4 text-destructive" />
                  ) : (
                    <Check className="w-4 h-4 opacity-50" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Button
            disabled={accepted.length > 0}
            className="flex-1"
            variant="secondary"
          >
            Reject
          </Button>
          <Button
            disabled={!accepted.length || accepted.length < 1}
            className="flex-1"
            onClick={() => console.log("first")}
          >
            Accept{" "}
            {accepted?.length > 0 &&
              `${accepted.length} Item${accepted.length > 1 ? "s" : ""}`}
          </Button>
        </div>
      </div>
    </SheetContent>
  );
};

export default ProductSheet;
