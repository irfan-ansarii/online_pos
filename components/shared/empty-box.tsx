import React from "react";
import { PackageOpen } from "lucide-react";
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
      <PackageOpen className="w-24 h-24 text-primary/80" />
      <h3 className="mt-2 font-semibold">{title || "No data found"}</h3>

      <div className="mt-4 text-muted-foreground">{description}</div>
    </div>
  );
};

export default EmptyBox;
