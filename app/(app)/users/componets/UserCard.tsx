import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar,  } from "lucide-react";
const UserCard = () => {
  return (
    <Card className="rounded-none md:rounded-md">
      <CardContent className="p-4 space-y-4 relative">
        <div className="flex gap-2 items-start">
          <Badge className="absolute right-4 top-4">Admin</Badge>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="font-medium space-y-0.5">
            <div>UserCard</div>
            <div className="text-muted-foreground text-xs">+91 9876543210</div>
            <div className="text-muted-foreground text-xs">example@email.com</div>
          </div>
        </div>
     
        <Badge className="w-full justify-between" variant="secondary">
          <div className="flex gap-2 items-center">
            <Calendar className="w-4 h-4" />
            <span>545434534</span>
          </div>
          <div className="flex gap-2 items-center">
            <Calendar className="w-4 h-4" /> <span>545434534</span>
          </div>
        </Badge>
      </CardContent>
    </Card>
  );
};

export default UserCard;
