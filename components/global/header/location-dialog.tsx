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
import { useLocations, useSwitchLocation } from "@/hooks/useUser";
import CreateLocation from "./location-create";
import { Home, Plus } from "lucide-react";

const LocationDialog: React.FC = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);
  const { data: locations, refetch, isLoading } = useLocations();
  const { mutate, isLoading: switching } = useSwitchLocation();

  const activeLocation = useMemo(() => {
    return locations?.data?.find((item: any) => item.active === true);
  }, [locations]);

  const onChange = (value: string) => {
    const locationId = Number(value);

    mutate(
      { locationId: locationId },
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
        {activeLocation?.name || "Select Location"}
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
          defaultValue={activeLocation?.id}
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
        <CreateLocation
          trigger={
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-full">
                <Plus className="w-5 h-5 mr-2" /> New
              </Button>
            </DialogTrigger>
          }
        ></CreateLocation>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;
