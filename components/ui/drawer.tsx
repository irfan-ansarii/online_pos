"use client";

import { forwardRef } from "react";
import { Drawer } from "vaul";

import { cn } from "@/lib/utils";

const DrawerTrigger = Drawer.Trigger;
const DrawerRoot = Drawer.Root;
const DrawerContent = forwardRef<
  React.ElementRef<typeof Drawer.Content>,
  React.ComponentPropsWithoutRef<typeof Drawer.Content>
>(({ className, children, ...props }, ref) => (
  <Drawer.Portal>
    <Drawer.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
    <Drawer.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] w-full top-[10%] z-50 max-w-xl transform !data-[state=open]:translate-x-[-50%] mt-24 h-96 max-h-[96%] rounded-t-xl bg-accent p-4 pt-6",
        className
      )}
      {...props}
    >
      <div className="absolute left-1/2 top-3 h-1.5 w-10 translate-x-[-50%] rounded-full bg-border dark:bg-background" />
      {children}
    </Drawer.Content>
  </Drawer.Portal>
));
DrawerContent.displayName = "Content";

export { DrawerRoot, DrawerTrigger, DrawerContent };
