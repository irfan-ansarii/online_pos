import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, BadgeCheck } from "lucide-react";

const UserCard = ({ user }: { user: any }) => {
  return (
    <Card>
      <Link href={`/users/${user.id}`}>
        <CardContent className="grid grid-cols-6 gap-3 items-center relative">
          <div className="flex gap-3 items-center col-span-3 md:col-span-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <div>{`${user.firstName} ${user.lastName}`}</div>
              <Badge>{user.role}</Badge>
            </div>
          </div>
          <div className="font-medium space-y-0.5 col-span-3 md:col-span-1">
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

          <div className="absolute right-4 md:relative top-4 md:top-auto text-center">
            <Badge className="uppercase">{user.status}</Badge>
          </div>

          <Badge
            className="grid grid-cols-9 py-1 text-muted-foreground font-medium col-span-6 md:col-span-2"
            variant="secondary"
          >
            <div className="flex justify-between col-span-4">
              <span>Joined</span>
              <span className="mx-2">∙</span>
              <span className="truncate">{user.createdAt}</span>
            </div>

            <Separator orientation="vertical" className="mx-auto w-0.5" />

            <div className="flex justify-between col-span-4">
              <span>Login</span>
              <span className="mx-2">∙</span>
              <span className="truncate">{user.lastSignInAt || "Never"}</span>
            </div>
          </Badge>
        </CardContent>
      </Link>
    </Card>
  );
};

export default UserCard;
