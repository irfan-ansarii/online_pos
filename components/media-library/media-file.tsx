import React, { useCallback } from "react";
import Image from "next/image";
import { CheckCircle, Loader2, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  JpgIcon,
  Mp3Icon,
  PdfIcon,
  TxtIcon,
  WordIcon,
  XlsIcon,
} from "@/components/shared/placeholders";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useToggle } from "@uidotdev/usehooks";

const placeholders: Record<string, JSX.Element> = {
  pdf: <PdfIcon className="w-10 h-10" />,
  jpg: <JpgIcon className="w-10 h-10" />,
  mp3: <Mp3Icon className="w-10 h-10" />,
  txt: <TxtIcon className="w-10 h-10" />,
  word: <WordIcon className="w-10 h-10" />,
  xls: <XlsIcon className="w-10 h-10" />,
};

interface Props {
  file: {
    id: number;
    title: string;
    ext: string;
    mime: string;
    src: string;
  };
  handleSelect: (file: any) => void;
}

const MediaFile = ({ file, handleSelect }: Props) => {
  const [open, toggleOpen] = useToggle(false);
  const [deleting, toggleDeleting] = useToggle(false);

  const renderPlaceholder = (file: Props["file"]) => {
    const icon = file.mime.includes("image")
      ? placeholders.jpg
      : placeholders[file.ext] || placeholders.txt;

    return (
      <AvatarFallback className="rounded-none w-full h-full">
        {icon}
      </AvatarFallback>
    );
  };

  // handle file select
  const onSelect = useCallback(() => {
    handleSelect(file);
  }, [handleSelect]);

  // handle file delete
  const onDelete = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    console.log("on delete");
    toggleDeleting(true);

    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    // delete file using try catch
    toggleOpen(false);
    toggleDeleting(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={toggleOpen}>
      <div className="border rounded-md overflow-hidden relative group">
        {/* file */}
        <Avatar className="w-auto h-auto relative rounded-none aspect-square">
          {file.mime.includes("image") && (
            <AvatarImage
              className="w-auto h-auto object-cover"
              src={file?.src}
              asChild
            >
              <Image src={file?.src} alt="123" width={100} height={100}></Image>
            </AvatarImage>
          )}

          {renderPlaceholder(file)}
        </Avatar>
        <div className="text-xs text-muted-foreground truncate p-1.5">
          {file.title}
        </div>

        {/* overlay */}
        <div className="absolute z-50 transition inset-0 opacity-0 group-hover:opacity-100 bg-black/50">
          <div className="flex items-center justify-center h-full">
            <Button size="icon" variant="link" onClick={onSelect}>
              <CheckCircle className="w-5 h-5 text-white" />
            </Button>

            <AlertDialogTrigger asChild>
              <Button size="icon" variant="link">
                <Trash2 className="w-5 h-5 text-white" />
              </Button>
            </AlertDialogTrigger>
          </div>
        </div>

        {/* alert dialog */}

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="w-28 bg-destructive text-destructive-foreground hover:bg-destructive/80"
            >
              {deleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </div>
    </AlertDialog>
  );
};

export default MediaFile;
