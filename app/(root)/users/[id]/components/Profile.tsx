import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MapPin } from "lucide-react";
const Profile = () => {
  return (
    <Card className="border-0 md:border">
      <CardHeader>
        <div className="flex gap-2 items-center">
          <Avatar className="w-12 h-12">
            <AvatarImage></AvatarImage>
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5">
            <CardTitle className="text-sm font-medium">John Doe</CardTitle>
            <div className="flex gap-1 text-muted-foreground items-center">
              <MapPin className="w-3 h-3" />
              <span>Delhi</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Separator className="mb-6" />
        <div className="text-muted-foreground uppercase mb-6 font-medium">
          Contact information
        </div>
        <div className="space-y-2 mb-6">
          <div className="flex">
            <div className="w-1/3 font-semibold">Phone:</div>
            <div className="w-2/3">+91 987654321</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-semibold">Company:</div>
            <div className="w-2/3">+91 987654321</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-semibold">GST:</div>
            <div className="w-2/3">+91 987654321</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-semibold">Address:</div>
            <div className="w-2/3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis,
              similique.
            </div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-semibold">Email:</div>
            <div className="w-2/3">example@email.com</div>
          </div>
        </div>
        <Separator className="mb-6" />
        <div className="text-muted-foreground uppercase mb-6 font-medium">
          Basic information
        </div>
        <div className="space-y-2">
          <div className="flex">
            <div className="w-1/3 font-semibold">Date of birth:</div>
            <div className="w-2/3">+91 987654321</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-semibold">Gender:</div>
            <div className="w-2/3">Male</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-semibold">Last visit:</div>
            <div className="w-2/3">example@email.com</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
