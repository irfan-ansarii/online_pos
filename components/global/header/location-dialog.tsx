"use client";
import React, { useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import CreateWorkspace from "./workspace-create";
import { Home, Plus } from "lucide-react";

interface WorkspaceDialogProps {
  children?: React.ReactNode;
}
const LocationDialog: React.FC<WorkspaceDialogProps> = ({ children }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { data: workspaces, refetch, isLoading } = {};
  const { mutate } = {};

  const activeWorkspace = useMemo(() => {
    return workspaces?.find((item) => item.active === true);
  }, [workspaces]);

  const onChange = (value: string) => {
    const workspaceId = Number(value);

    mutate(
      { workspace: workspaceId },
      {
        onSuccess: () => {
          refetch();
          setOpen(false);
        },
      }
    );
  };

  const Trigger = isLoading ? (
    <Skeleton className="w-44 h-4" />
  ) : (
    children || (
      <Button variant="secondary">
        <Home className="w-5 h-5 mr-2" />
        {activeWorkspace?.name || "Select Location"}
      </Button>
    )
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="flex items-center">
        {Trigger}
      </DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-md">
        <DialogHeader className="text-left pb-4">
          <DialogTitle className="text-xl">Select Location</DialogTitle>
        </DialogHeader>
        <RadioGroup
          defaultValue={activeWorkspace?.id}
          className="space-y-2 mb-4"
          onValueChange={onChange}
        >
          {[...Array(4)].map((item, i) => (
            <Label
              htmlFor={`${i}`}
              className={`flex border px-5 py-4 rounded-md cursor-pointer justify-between items-center`}
            >
              <div>
                <p className="font-medium mb-1">Location</p>
                <span className="inline text-muted-foreground">
                  some text here
                </span>
              </div>

              <RadioGroupItem value={`${i}`} id={`${i}`} />
            </Label>
          ))}
        </RadioGroup>
        <CreateWorkspace
          trigger={
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-full">
                <Plus className="w-5 h-5 mr-2" /> New
              </Button>
            </DialogTrigger>
          }
        ></CreateWorkspace>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;
