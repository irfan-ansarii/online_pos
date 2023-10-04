import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
const Loading = () => {
  return (
    <Card className="cursor-pointer relative overflow-hidden">
      <CardContent className="flex p-0">
        <Skeleton className="w-32 h-32 shrink-0 rounded-l-none" />

        <div className="flex flex-col h-full gap-4 px-4 py-4 grow">
          <Skeleton className="h-3 " />
          <Skeleton className="h-3 " />
          <Skeleton className="h-3 " />
          <Skeleton className="h-3 " />
        </div>
      </CardContent>
    </Card>
  );
};

export default Loading;
