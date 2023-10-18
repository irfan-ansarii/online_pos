import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
const Loading = () => {
  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-8 gap-3">
          <div className="space-y-1 col-span-3">
            <Skeleton className="h-3 rounded-full" />
            <Skeleton className="h-2.5 rounded-full" />
          </div>
          <div className="space-y-1 col-span-3">
            <Skeleton className="h-3 rounded-full" />
            <Skeleton className="h-2.5 rounded-full" />
          </div>
          <div className="space-y-1 items-end col-span-2">
            <Skeleton className="h-3 rounded-full" />
            <Skeleton className="h-2.5 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-6 mt-4 rounded-full" />
      </CardContent>
    </Card>
  );
};

export default Loading;
