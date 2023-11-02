"use client";
import React from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import SimpleBar from "simplebar-react";
import { useToggle } from "@uidotdev/usehooks";
import { useCreateFile } from "@/hooks/useFile";
import { Input } from "../ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface Props {
  children?: React.ReactNode;
  onSelect?: React.MouseEventHandler<HTMLElement>;
  selected?: number;
}

const ext = [
  "/assets/files/pdf.svg",
  "/assets/files/jpg.svg",
  "/assets/files/mp3.svg",
  "/assets/files/txt.svg",
  "/assets/files/word.svg",
  "/assets/files/xls.svg",
];

const MediaLibrary: React.FC<Props> = ({
  children,
  onSelect,
  selected = 5,
}) => {
  const [open, toggle] = useToggle(false);

  const { isLoading, mutate } = useCreateFile();
  const handleSelect = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (onSelect) {
        onSelect(event);
        toggle();
      }
    },
    [onSelect]
  );

  const onChange = (e: any) => {
    if (!e.target.files) return;

    const files = e.target.files;
    const form = new FormData();
    for (const file of files) {
      console.log(file);
      form.append("files", file);
    }

    mutate(form, {
      onSuccess: (r) => console.log("success;", r),
      onError: (e) => console.log("error:", e),
    });
  };
  return (
    <Sheet open={open} onOpenChange={toggle}>
      <SheetTrigger asChild>
        {children ? children : <Button>Open</Button>}
      </SheetTrigger>
      <SheetContent className="md:max-w-lg">
        <div className="flex flex-col h-full gap-6">
          <div>
            <SheetHeader className="md:pb-2">
              <SheetTitle>Media Library</SheetTitle>
            </SheetHeader>
            <div>
              <Input placeholder="Search..."></Input>
            </div>
          </div>

          <SimpleBar className="h-full grow overflow-y-auto -mx-6 px-6">
            <div className="relative rounded-md bg-accent border-2 border-dashed h-20 mb-3">
              <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                {isLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                ) : (
                  <ImagePlus className="w-8 h-8" />
                )}
              </span>

              {!isLoading && (
                <Input
                  type="file"
                  multiple
                  className="h-full file:hidden opacity-0 cursor-pointer"
                  onChange={onChange}
                />
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[...Array(40)].map((_, i) => (
                <div className="border rounded-md overflow-hidden">
                  <Avatar
                    onClick={handleSelect}
                    className="w-auto h-auto relative rounded-none aspect-square"
                  >
                    <div className="flex items-center justify-center flex-1">
                      <AvatarImage
                        src={ext[Math.floor(Math.random() * ext.length)]}
                        className="w-10 h-10"
                      ></AvatarImage>
                    </div>
                    <AvatarFallback className="w-full h-full rounded-none">
                      g
                    </AvatarFallback>
                  </Avatar>

                  <div className="text-xs truncate p-1.5">
                    Lorem ipsum dolor sit amet.
                  </div>
                </div>
              ))}
            </div>
          </SimpleBar>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MediaLibrary;
