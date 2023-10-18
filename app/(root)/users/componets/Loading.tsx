import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const Loading = () => {
  return (
    <Card>
      <CardContent className="space-y-3 relative flex flex-col justify-between h-full">
        <div className="flex gap-2 items-start">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2 grow">
            <Skeleton className="h-3 w-1/2 rounded-full" />
            <Skeleton className="h-2.5 w-3/4" />
            <Skeleton className="h-2.5" />
          </div>
        </div>
        <Skeleton className="h-5 rounded-full" />
      </CardContent>
    </Card>
  );
};

export default Loading;
