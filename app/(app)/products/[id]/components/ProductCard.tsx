import React from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
const ProductCard = () => {
  return (
    <Card className="overflow-hidden relative">
      <Badge className="absolute right-4 top-4">In stock</Badge>
      <CardContent className="p-0">
        <div className="flex items-stretch">
          <Avatar className="w-32 h-32 rounded-none">
            <AvatarImage></AvatarImage>
            <AvatarFallback className="rounded-none">P</AvatarFallback>
          </Avatar>
          <div className="flex flex-col w-full h-full grow p-4">
            <CardTitle className="text-sm font-medium">Title</CardTitle>
            <CardDescription>GN314256</CardDescription>
            <CardDescription>GN314256</CardDescription>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
