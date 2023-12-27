"use client";
import React, { FC, Children, HTMLProps } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BadgeProps {
  maxCount?: number;
  children: React.ReactNode;
}

export const AvatarGroup: FC<BadgeProps> = ({ maxCount = 4, children }) => {
  const childrenWithProps = Children.toArray(children).map((child) => child);

  const numOfChildren = childrenWithProps.length;

  const childrenShow = childrenWithProps.slice(0, maxCount);
  const childrenHidden = childrenWithProps.slice(maxCount, numOfChildren);

  if (maxCount && maxCount < numOfChildren) {
    childrenShow.push(
      <Popover>
        <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Avatar className="w-10 h-10 border-2 select-none cursor-default">
            <AvatarFallback className="text-muted-foreground">
              {`+${numOfChildren - maxCount}`}
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="max-w-[14.7rem] w-auto p-2 bg-background">
          <div className="flex items-center flex-wrap gap-1">
            {childrenHidden}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
  return <div className="flex truncate -space-x-2">{childrenShow}</div>;
};

export const AvatarItem = ({
  className,
  src,
  iconClassName = "w-4 h-4",
  width = 40,
  height = 40,
}: {
  className?: HTMLProps<HTMLElement>["className"];
  src: string;
  iconClassName?: string;
  width?: number;
  height?: number;
}) => {
  return (
    <Avatar className={cn("w-10 h-10 border-2", className)}>
      <AvatarImage src={src} asChild className="object-cover">
        <Image src={src} alt={src} width={width} height={height} />
      </AvatarImage>
      <AvatarFallback className="w-full h-full rounded-none text-muted-foreground">
        <ImageIcon className={iconClassName} />
      </AvatarFallback>
    </Avatar>
  );
};
