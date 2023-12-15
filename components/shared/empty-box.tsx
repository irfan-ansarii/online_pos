import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
const EmptyBox = ({
  className,
  title,
  description,
}: {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col h-[60vh] justify-center items-center ",
        className
      )}
    >
      <div className="mb-4">
        <Image src="/assets/not-found.png" width={140} height={140} alt="" />
      </div>
      <h3 className="mt-2 font-semibold">{title || "No data found"}</h3>

      <div className="mt-4 text-muted-foreground">{description}</div>
    </div>
  );
};

export default EmptyBox;
