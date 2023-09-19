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
import WorkspaceDialog from "./workspace-dialog";
import { ChevronDown, Power } from "lucide-react";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();

  const { mutate } = { mutate: () => {} };
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <div className="flex gap-2 items-center text-muted-foreground hover:text-foreground transition duration-500">
          <Avatar className="border-2">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="hidden md:flex">
            <span className="text-sm mr-1">Irfan Ansari</span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="px-3 pb-3 w-40">
        <DropdownMenuLabel>Irfan Ansari</DropdownMenuLabel>
        <DropdownMenuSeparator className="mb-3" />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Teams</DropdownMenuItem>

        <WorkspaceDialog>
          <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground">
            Workspace
          </div>
        </WorkspaceDialog>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            mutate();
            router.replace("/login");
          }}
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
