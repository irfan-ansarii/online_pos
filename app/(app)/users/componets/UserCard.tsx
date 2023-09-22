import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
const UserCard = () => {
  return (
    <Card className="rounded-none md:rounded-md">
      <CardContent className="p-4 space-y-2 relative">
        <div className="flex gap-2 items-center">
          <Badge className="absolute right-4 top-4">Admin</Badge>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="font-medium space-y-0.5">
            <div>UserCard</div>
          </div>
        </div>
        <div>
          <div>Phone: Lorem ipsum dolor sit amet.</div>
          <div>Email: Lorem ipsum dolor sit amet.</div>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2 items-center text-muted-foreground">
            <Calendar className="w-4 h-4" /> <span>545434534</span>
          </div>
          <div className="flex gap-2 items-center text-muted-foreground">
            <Calendar className="w-4 h-4" /> <span>545434534</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
