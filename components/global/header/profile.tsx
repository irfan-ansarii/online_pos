"use client";
import { JwtPayload } from "jsonwebtoken";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/auth-actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, LogOut } from "lucide-react";

import { AvatarItem } from "@/components/shared/avatar";

const Profile = ({ session }: { session: JwtPayload }) => {
  const router = useRouter();

  const logout = async () => {};

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="focus-visible:ring-transparent outline-none">
        <div className="flex gap-2 items-center text-muted-foreground hover:text-foreground transition duration-500">
          <AvatarItem src="" />
          <div className="hidden md:flex">
            <span className="text-sm mr-1">
              {session?.firstName ? session?.firstName : null}{" "}
              {session?.lastName ? session?.lastName : null}
            </span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 bg-background">
        <DropdownMenuLabel>
          <span>{session?.firstName ? session?.firstName : null}</span>

          <span className="ml-1">
            {session?.lastName ? session?.lastName : null}
          </span>

          <div className="text-xs leading-none text-muted-foreground font-normal">
            {session?.email}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Profile</DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="flex">
          <span className="text-destructive flex gap-2 items-center">
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Logout</span>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
