"use client";
import React, { useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLocations, useSwitchLocation } from "@/hooks/useUser";
import { useSession } from "@/hooks/useAuth";
import CreateLocation from "./location-create";
import { Home, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const LocationDialog: React.FC = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);
  const { data: locations, refetch, isLoading } = useLocations();
  const { mutate, isLoading: switching } = useSwitchLocation();

  const { data: session } = useSession();

  const onChange = (value: string) => {
    const locationId = Number(value);

    mutate(
      { locationId },
      {
        onSuccess: (res) => {
          toast({
            variant: "success",
            title: `Location changed to ${res.data.data.location.name}`,
          });
          refetch();
        },
        onError: (err: any) => {
          toast({
            variant: "error",
            title: err.response.data.message,
          });
        },
        onSettled: () => {
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
        {session?.data?.data?.location?.name || "Select Location"}
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
          <DialogTitle className="text-xl">Change Location</DialogTitle>
          <DialogDescription>
            Click on the locations below to manage data for that location.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup
          defaultValue={session?.data.data.locationId}
          className="space-y-2 mb-4"
          onValueChange={onChange}
        >
          {locations?.data?.data?.map((item: any) => (
            <Label
              key={item.id}
              htmlFor={`${item.id}`}
              className={`flex border px-5 py-4 rounded-md cursor-pointer justify-between items-center`}
            >
              <div className="space-y-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground capitalize font-normal">
                  {item.type}
                </p>
                <p className="text-muted-foreground capitalize font-normal">
                  {item.city}
                </p>
              </div>

              <RadioGroupItem value={item.id} id={`${item.id}`} />
            </Label>
          ))}

          {(!locations || locations?.data?.data?.length == 0) && (
            <div>No Location Found</div>
          )}
        </RadioGroup>
        <CreateLocation
          trigger={
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-full">
                <Plus className="w-5 h-5 mr-2" /> New
              </Button>
            </DialogTrigger>
          }
          refetch={refetch}
        ></CreateLocation>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;
