import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
const ProductLoading = () => {
  return (
    <Card className="cursor-pointer">
      <CardHeader className="p-0">
        <Skeleton className="aspect-square rounded-t rounded-b-none w-full" />
      </CardHeader>
      <CardContent className="px-2 py-3 space-y-2">
        <Skeleton className="h-3" />
        <Skeleton className="w-2/3 h-2.5" />
      </CardContent>
    </Card>
  );
};

export default ProductLoading;
