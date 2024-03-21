"use client";
import { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/auth-actions";

import { LogOut } from "lucide-react";

import { AvatarItem } from "@/components/shared/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Profile = ({ session }: { session: JwtPayload }) => {
  const router = useRouter();

  const onClick = async () => {
    try {
      await logout();
      router.refresh();
    } catch (error) {}
  };

  return (
    <>
      <div className="gap-2 items-center text-muted-foreground hover:text-foreground transition duration-500 hidden md:flex">
        <AvatarItem src="" />
        <div className="hidden md:flex">
          <span className="text-sm mr-1">
            {session?.firstName ? session?.firstName : null}{" "}
            {session?.lastName ? session?.lastName : null}
          </span>
        </div>
      </div>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onClick}>
            <span className="text-destructive flex gap-2 items-center">
              <LogOut className="w-5 h-5" />
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Logout</TooltipContent>
      </Tooltip>
    </>
  );
};

export default Profile;
