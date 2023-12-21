import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const Loading = () => {
  return (
    <Card>
      <CardContent className="grid grid-cols-6 gap-3 items-center">
        <div className="flex gap-2 items-center col-span-3 md:col-span-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2 grow">
            <Skeleton className="h-3 w-1/2 rounded-full" />
            <Skeleton className="h-2.5 w-3/4" />
          </div>
        </div>
        <div className="col-span-3 md:col-span-2">
          <div className="space-y-2 grow">
            <Skeleton className="h-3 w-1/2 rounded-full" />
            <Skeleton className="h-2.5 w-3/4" />
          </div>
        </div>
        <div className="hidden col-span-2 md:block">
          <Skeleton className="h-5 rounded-full w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default Loading;
