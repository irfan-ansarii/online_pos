import React from "react";
import { Skeleton } from "../ui/skeleton";

const LoadingSmall = () => {
  return (
    <div className="space-y-2">
      {[...Array(4)].map((_, i) => (
        <div className="flex py-3 items-center rounded-md px-3 border" key={i}>
          <div className="space-y-2 grow">
            <Skeleton className="w-32 h-3" />
            <Skeleton className="w-48 h-2.5" />
          </div>
          <Skeleton className="w-4 h-4 rounded-full" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSmall;
