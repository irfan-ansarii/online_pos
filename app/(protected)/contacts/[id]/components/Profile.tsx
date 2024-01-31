import React from "react";
import { User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = ({ customer }: { customer: any }) => {
  return (
    <Card className="rounded-none md:rounded-md order-1">
      <CardContent>
        <CardHeader className="p-0 pb-4">
          <div className="flex gap-2 items-center">
            <Avatar className="border-2">
              <AvatarImage></AvatarImage>
              <AvatarFallback>
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <CardTitle className="text-base">
                {customer?.firstName}
                {customer?.lastName}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <Separator className="mb-6" />
        <CardTitle className="text-base mb-6 text-muted-foreground">
          General
        </CardTitle>

        <div className="space-y-2 mb-6">
          <div className="flex">
            <div className="w-1/3 font-semibold">Phone:</div>
            <div className="w-2/3">{customer?.phone}</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-semibold">Email:</div>
            <div className="w-2/3">{customer?.email}</div>
          </div>
        </div>
        <Separator className="mb-6" />
        <CardTitle className="text-base mb-6 text-muted-foreground">
          Addresses
        </CardTitle>
        <div className="space-y-6">
          {customer?.addresses?.map((address: any) => (
            <div key={address.id}>
              <div>
                {address.company && address.company}
                <br />
                {address.gst && address.gst}
                <br />
                {address.address && address.address}
                <br />
                {address.address2 && address.address2address.address2}
                {address.city && address.city}
                {address.state && address.state}
                {address.zip && address.zip}
                <br />
                {address.country && address.country}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;