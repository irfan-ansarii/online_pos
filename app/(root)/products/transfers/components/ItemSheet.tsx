import React, { useState, useMemo, ChangeEvent } from "react";
import Image from "next/image";
import { Image as ImageIcon, Loader2 } from "lucide-react";

import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAcceptTransfer, useRejectTransfer } from "@/hooks/useProduct";
import { useToast } from "@/components/ui/use-toast";

interface LineItem {
  id: number;
  title: string;
  variantId: number;
  variantTitle?: string;
  image?: ImageType;
  quantity: number;
  status: string;
}
interface ImageType {
  id: number;
  title: string;
  src: string;
}

interface Transfer {
  id: number;
  toId: number;
  lineItems: LineItem[];
  source: Source;
  status: string;
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
  const [accepted, setAccepted] = useState<LineItem[]>([]);

  const { toast } = useToast();
  const { mutate, isLoading } = useAcceptTransfer();
  const { mutate: reject, isLoading: rejecting } = useRejectTransfer();

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
  const handleClick = (checked: boolean, item: LineItem) => {
    const index = accepted.findIndex((acc) => acc.id === item.id);

    if (index === -1 && checked) {
      setAccepted([...accepted, item]);
      return;
    }

    accepted.splice(index, 1);
    setAccepted([...accepted]);
  };

  // handle accept
  const handleSubmit = () => {
    const data = accepted.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      variantId: i.variantId,
      toId: transfer.toId,
    }));

    mutate(
      { id: transfer.id, lineItems: data },
      {
        onSuccess: (res) => {
          toast({
            variant: "success",
            title: "Transfer created successfully!",
          });
          setAccepted([]);
        },
        onError: (error: any) => {
          toast({
            variant: "error",
            title: error.response.data.message || "Something went wrong",
          });
        },
      }
    );
  };

  // handle reject
  const handleReject = () => {
    if (transfer.status !== "pending") {
      return;
    }

    reject(
      { id: transfer.id },
      {
        onSuccess: (res) => {
          toast({
            variant: "success",
            title: "Transfer rejected successfully.",
          });
        },
        onError: (error: any) => {
          toast({
            variant: "error",
            title: error.response.data.message || "Something went wrong",
          });
        },
      }
    );
  };

  return (
    <SheetContent
      className="md:max-w-lg"
      onOpenAutoFocus={() => setAccepted([])}
    >
      {(isLoading || rejecting) && (
        <div className="absolute w-full h-full top-0 left-0 z-20"></div>
      )}

      <div className="flex flex-col h-full gap-4">
        <SheetHeader className="mb-0">
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
        <div className="relative -mx-6 px-6 -my-3 py-3 grow max-h-full overflow-auto snap-y snap-mandatory space-y-1 scrollbox mb-4">
          {filteredList.length == 0 && (
            <div className="text-center">No result found.</div>
          )}
          {filteredList?.map((item, i) => (
            <Label
              htmlFor={`${item.id}`}
              className={`flex relative rounded-md border p-2 pr-4 items-center snap-stat cursor-pointer `}
              key={i}
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

                <Checkbox
                  id={`${item.id}`}
                  disabled={
                    item.status === "completed" ||
                    transfer.status === "rejected"
                  }
                  defaultChecked={item.status === "completed"}
                  onCheckedChange={(checked: boolean) =>
                    handleClick(checked, item)
                  }
                />
              </div>
            </Label>
          ))}
        </div>

        <div className="flex gap-4">
          {/* render reject button conditionally */}
          {transfer.status === "pending" && (
            <Button
              disabled={accepted.length > 0 || rejecting}
              className="flex-1"
              variant="secondary"
              onClick={handleReject}
            >
              {rejecting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Reject"
              )}
            </Button>
          )}

          {/* submit button */}
          <Button
            disabled={!accepted.length || accepted.length < 1 || isLoading}
            className="flex-1"
            onClick={handleSubmit}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Accept"
            )}
          </Button>
        </div>
      </div>
    </SheetContent>
  );
};

export default ProductSheet;
