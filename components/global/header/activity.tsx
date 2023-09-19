import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, CheckCircle2 } from "lucide-react";
const Activity = () => {
  return (
    <Popover>
      <PopoverTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
        <Bell className="w-5 h-5" />
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <div className="border-b flex items-center justify-between -mt-2 pb-2">
          <div className="font-semibold">Activity</div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <CheckCircle2 className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mark all as read</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="flex flex-col divide-y">
            {[...Array(4)].map((el, i) => (
              <div className="flex space-x-4 w-full py-2" key={`activity-${i}`}>
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/avatars/01.png" alt="Image" />
                  <AvatarFallback className="text-xs">OM</AvatarFallback>
                </Avatar>
                <div className="ml-3 text-muted-foreground">
                  <div>
                    <span className="text-foreground mr-1">Jean Bowman</span>
                    <span className="text-sm">
                      I nvited you to new project.
                    </span>
                  </div>
                  <span className="text-xs">4 minutes ago</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t flex items-center justify-center pt-4">
          <a className="hover:underline" href="/">
            View all activity
          </a>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Activity;
