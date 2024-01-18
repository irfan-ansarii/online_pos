import React from "react";
import { format } from "date-fns";
import { User } from "@prisma/client";

import { BadgeCheck, User as UserIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import UserSheet from "./UserSheet";

const UserCard = ({ user }: { user: User }) => {
  return (
    <Card className="hover:bg-accent">
      <UserSheet user={user}>
        <CardContent className="grid grid-cols-8 gap-3 items-center relative">
          <div className="flex gap-3 items-center col-span-4 md:col-span-3">
            <Avatar className="border-2 text-muted-foreground">
              <AvatarFallback>
                <UserIcon className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
              <Badge className="py-0 uppercase">{user.role}</Badge>
            </div>
          </div>
          <div className="space-y-0.5 col-span-2">
            <div className="text-muted-foreground flex gap-2 items-center">
              <div className="truncate">{user.phone}</div>
              {user.phoneConfirmedAt && (
                <BadgeCheck className="w-4 h-4 text-emerald-500" />
              )}
            </div>
            <div className="text-muted-foreground flex gap-2 items-center">
              <div className="truncate">{user.email}</div>
              {user.emailConfirmedAt && (
                <BadgeCheck className="w-4 h-4 text-emerald-500" />
              )}
            </div>
          </div>
          <div className="hidden md:block col-span-2">
            <div className="inline-flex flex-col gap-0.5">
              <Badge
                className="py-0 truncate text-muted-foreground font-normal"
                variant="secondary"
              >
                <span className="uppercase">Joined</span>
                <span className="mx-1 opacity-40">|</span>
                <span className="ml-auto">
                  {format(new Date(user.createdAt), "dd MMM, yyyy")}
                </span>
              </Badge>
              <Badge
                className="py-0 truncate text-muted-foreground font-normal"
                variant="secondary"
              >
                <span className="uppercase">Last login</span>
                <span className="mx-1 opacity-40">|</span>
                <span className="ml-auto">
                  {format(new Date(user.createdAt), "dd MMM, yyyy")}
                </span>
              </Badge>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 text-right">
            <Badge className="uppercase" variant="secondary">
              {user.status}
            </Badge>
          </div>
        </CardContent>
      </UserSheet>
    </Card>
  );
};

export default UserCard;
