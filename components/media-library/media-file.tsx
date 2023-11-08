import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  JpgIcon,
  Mp3Icon,
  PdfIcon,
  TxtIcon,
  WordIcon,
  XlsIcon,
} from "@/components/shared/placeholders";

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
  handleSelect: React.MouseEventHandler<HTMLDivElement>;
}

const MediaFile = ({ file, handleSelect }: Props) => {
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

  return (
    <div
      onClick={() => handleSelect(file)}
      className="border rounded-md overflow-hidden relative cursor-pointer"
      key={file.id}
    >
      <Avatar className="w-auto h-auto relative rounded-none aspect-square">
        {file.mime.includes("image") && (
          <div className="flex items-center justify-center aspect-square">
            <AvatarImage
              className="w-auto h-auto object-cover"
              src={file.src}
              asChild
            >
              <Image
                src={`/${file.src}`}
                alt="123"
                width={100}
                height={100}
              ></Image>
            </AvatarImage>
          </div>
        )}

        {renderPlaceholder(file)}
      </Avatar>
      <div className="text-xs truncate p-1.5">{file.title}</div>
    </div>
  );
};

export default MediaFile;
