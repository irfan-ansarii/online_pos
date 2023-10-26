import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
const Loading = () => {
  return (
    <Card>
      <CardContent className="grid grid-cols-5 gap-2 items-center">
        <div className="flex flex-col col-span-3 space-y-1 md:col-span-1">
          <Skeleton className="h-3 w-2/3 rounded-full" />
          <Skeleton className="h-2.5 w-2/3 rounded-full" />
        </div>

        <div className="flex flex-col col-span-3 space-y-1 md:col-span-1">
          <Skeleton className="h-3 w-2/3 rounded-full" />
          <Skeleton className="h-2.5 w-2/3 rounded-full" />
        </div>

        <div className="flex -space-x-2 col-span-6 md:col-span-2">
          {[...Array(4)].map((e, i) => (
            <Skeleton className="w-10 h-10 rounded-full" />
          ))}
        </div>

        <Skeleton className="flex-1 h-6 w-full rounded-full col-span-6 md:col-span-1" />
      </CardContent>
    </Card>
  );
};

export default Loading;
