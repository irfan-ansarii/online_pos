import React, { useState, useCallback } from "react";
import SimpleBar from "simplebar-react";
import { useToggle } from "@uidotdev/usehooks";
import { useFiles } from "@/hooks/useFile";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Upload from "./upload";
import MediaFile from "./media-file";
import ErrorBox from "../shared/error-box";

interface Props {
  children?: React.ReactNode;
  onSelect?: React.MouseEventHandler<HTMLElement>;
  selected?: number;
  filter?: number;
}

const MediaLibrary: React.FC<Props> = ({
  children,
  onSelect,
  selected = 5,
  filter,
}) => {
  const [query, setQuery] = useState("");
  const [open, toggle] = useToggle(false);

  const {
    data: files,
    isLoading,
    isError,
    error,
  } = useFiles({ search: query });

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
        <div className="flex flex-col h-full gap-6">
          <div>
            <SheetHeader className="md:pb-2">
              <SheetTitle>Media Library</SheetTitle>
            </SheetHeader>
            <div>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
              ></Input>
            </div>
          </div>

          <SimpleBar className="h-full grow overflow-y-auto -mx-6 px-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3">
                <Upload />
              </div>
              {isLoading
                ? [...Array(6)].map((_, i) => (
                    <Skeleton className="aspect-square" key={i} />
                  ))
                : files?.pages?.map((page) =>
                    page?.data?.data?.map((file: any) => (
                      <MediaFile
                        handleSelect={handleSelect}
                        file={file}
                        key={file.id}
                      />
                    ))
                  )}

              {isError && (
                <ErrorBox
                  className="col-span-3"
                  title={error?.response?.data?.message}
                />
              )}
            </div>
          </SimpleBar>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MediaLibrary;
