"use client";

import { forwardRef } from "react";
import { Drawer } from "vaul";

import { cn } from "@/lib/utils";

const Trigger = Drawer.Trigger;
const Root = Drawer.Root;
const Content = forwardRef<
  React.ElementRef<typeof Drawer.Content>,
  React.ComponentPropsWithoutRef<typeof Drawer.Content>
>(({ className, children, ...props }, ref) => (
  <Drawer.Portal>
    <Drawer.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
    <Drawer.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 h-96 max-h-[96%] rounded-t-xl bg-secondary dark:bg-border",
        className
      )}
      {...props}
    >
      <div className="absolute left-1/2 top-3 h-2 w-16 translate-x-[-50%] rounded-full bg-border dark:bg-background" />
      {children}
    </Drawer.Content>
  </Drawer.Portal>
));
Content.displayName = "Content";

export { Root, Trigger, Content };
