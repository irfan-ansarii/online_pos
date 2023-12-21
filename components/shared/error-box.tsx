import React from "react";
import { PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
const ErrorBox = ({
  className,
  title,
  description,
  reset,
}: {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  reset?: () => void;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col h-[60vh] justify-center items-center ",
        className
      )}
    >
      <PackageSearch className="w-24 h-24 text-destructive/80" />
      <h3 className="mt-2 font-semibold">{title || "No data found"}</h3>

      <div className="text-muted-foreground">{description}</div>
      <div className="text-center mt-4">
        <Button onClick={reset} className="w-28">
          Retry
        </Button>
      </div>
    </div>
  );
};

export default ErrorBox;
