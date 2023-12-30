import React from "react";
import { PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
const ErrorBox = ({
  className,
  title,
  status,
  description,
  reset,
}: {
  className?: string;
  title?: React.ReactNode;
  status?: number | string;
  description?: React.ReactNode;
  reset?: () => void;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col min-h-[60vh] h-full justify-center items-center ",
        className
      )}
    >
      <div className="relative text-destructive/80">
        <PackageSearch className="w-24 h-24  relative z-10" />

        <div className="absolute inset-0 flex items-center justify-center text-9xl font-black">
          5 <span className="opacity-0 px-16"></span> 0
        </div>
      </div>

      <h3 className="mt-4 font-semibold uppercase tracking-widest text-muted-foreground">
        {title || "No data found"}
      </h3>

      <div className="text-muted-foreground">{description}</div>
      <div className="text-center mt-4">
        <Button onClick={reset} variant="link" className="w-28">
          Retry
        </Button>
      </div>
    </div>
  );
};

export default ErrorBox;
