"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LocationDialog from "./location-dialog";
import { ChevronDown, Power } from "lucide-react";

import { useRouter } from "next/navigation";
// import { useLogout } from "@/hooks/useAuth";

import { useSession } from "@/hooks/useSession";

const Profile = () => {
  const router = useRouter();
  const { session } = useSession();
  // const { mutate } = useLogout();

  const logout = () => {
    // mutate({
    //   onSuccess: () => {
    //     router.replace("/login");
    //   },
    // });
  };
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <div className="flex gap-2 items-center text-muted-foreground hover:text-foreground transition duration-500">
          <Avatar className="border-2">
            <AvatarFallback>IR</AvatarFallback>
          </Avatar>
          <div className="hidden md:flex">
            <span className="text-sm mr-1">
              {session?.firstName ? session?.firstName : null}{" "}
              {session?.lastName ? session?.lastName : null}
            </span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="px-3 pb-3 w-40">
        <DropdownMenuLabel>
          {session?.firstName ? session?.firstName : null}{" "}
          {session?.lastName ? session?.lastName : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mb-3" />
        <DropdownMenuItem>Profile</DropdownMenuItem>

        {/* <LocationDialog>
          <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground">
            Branches
          </div>
        </LocationDialog> */}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="flex gap-3 text-destructive bg-destructive/10 dark:bg-destructive dark:text-foreground items-center"
        >
          <Power className="w-4 h-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
