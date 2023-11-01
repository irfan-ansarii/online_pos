import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
const Loading = () => {
  return (
    <Card>
      <CardContent className="grid grid-cols-5 items-center">
        <div className="flex gap-3 items-center col-span-3 md:col-span-2">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 rounded-full" />
            <Skeleton className="w-2/3 h-3 rounded-full" />
          </div>
        </div>

        <div className="col-span-2 md:col-span-3 flex justify-end">
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default Loading;
