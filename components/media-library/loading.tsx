import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
const Loading = () => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Skeleton className="aspect-aquare" />
      <Skeleton className="h-3 w-10/12" />
    </div>
  );
};

export default Loading;
