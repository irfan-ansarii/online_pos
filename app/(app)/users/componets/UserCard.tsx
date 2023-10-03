import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

const UserCard = () => {
  return (
    <Card>
      <CardContent className="space-y-3 relative">
        <div className="flex gap-2 items-start">
          <Badge className="absolute right-4 top-4">Admin</Badge>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="font-medium space-y-0.5">
            <div>UserCard</div>
            <div className="text-muted-foreground text-xs">+91 9876543210</div>
            <div className="text-muted-foreground text-xs">
              example@email.com
            </div>
          </div>
        </div>

        <Badge className="grid grid-cols-9 py-1" variant="secondary">
          <div className="flex justify-between col-span-4">
            <Calendar className="w-4 h-4" />
            <span>10</span>
          </div>

          <Separator orientation="vertical" className="mx-auto w-0.5" />

          <div className="flex justify-between col-span-4">
            <Calendar className="w-4 h-4" />
            <span>10,109.00</span>
          </div>
        </Badge>
      </CardContent>
    </Card>
  );
};

export default UserCard;
