import React, { useState, useCallback } from "react";

import { Search } from "lucide-react";

import { useToggle } from "@uidotdev/usehooks";
import { useFiles } from "@/hooks/useFiles";

import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import Upload from "./upload";
import MediaFile from "./media-file";
import ErrorBox from "../shared/error-box";

interface Props {
  children?: React.ReactNode;
  onSelect?: React.MouseEventHandler<HTMLElement>;
  selected?: number;
}

const MediaLibrary: React.FC<Props> = ({ children, onSelect, selected }) => {
  const [query, setQuery] = useState("");
  const [open, toggle] = useToggle(false);

  const { files, isLoading, isError } = useFiles({ search: query });

  const handleSelect = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (onSelect) {
        onSelect(event);
        toggle();
      }
    },
    [onSelect, toggle]
  );

  return (
    <Sheet open={open} onOpenChange={toggle}>
      <SheetTrigger asChild>{children || <Button>Open</Button>}</SheetTrigger>
      <SheetContent className="md:max-w-lg">
        <div className="flex flex-col h-full gap-4">
          <SheetHeader className="mb-0">
            <SheetTitle>Media Library</SheetTitle>
          </SheetHeader>
          <div className="relative">
            <span className="inline-flex inset-y-0 left-3 absolute items-center text-muted-foreground">
              <Search className="w-5 h-5" />
            </span>
            <Input
              className="pl-10 bg-secondary"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
            ></Input>
          </div>
          <Upload />
          <div className="h-full flex-1 overflow-y-auto scrollbox">
            <div className="grid grid-cols-3 gap-3">
              {isLoading
                ? [...Array(6)].map((_, i) => (
                    <Skeleton className="aspect-square" key={i} />
                  ))
                : files?.data?.map((file) => (
                    <MediaFile
                      handleSelect={handleSelect}
                      file={file}
                      key={file.id}
                    />
                  ))}

              {isError && <ErrorBox className="col-span-3" />}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MediaLibrary;
