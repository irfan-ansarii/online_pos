"use client";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import CreateLocation from "./location-create";
import { Home, Loader2, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { auth } from "@/lib/auth";

const LocationDialog = () => {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const session = auth();

  const onChange = (value: string) => {
    const locationId = Number(value);

    // mutate(
    //   { locationId },
    //   {
    //     onSuccess: (res) => {
    //       toast({
    //         variant: "success",
    //         title: `Location changed to ${res.data.data.location.name}`,
    //       });
    //       refreshSession();
    //     },
    //     onError: (err: any) => {
    //       toast({
    //         variant: "error",
    //         title: err.response.data.message,
    //       });
    //     },
    //     onSettled: () => {
    //       setOpen(false);
    //     },
    //   }
    // );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {session?.role === "admin" ? (
        <DialogTrigger asChild className="flex items-center">
          <Button variant="secondary">
            <Home className="w-5 h-5 mr-2" />
            {session?.location?.name || "Select Location"}
          </Button>
        </DialogTrigger>
      ) : (
        <Button variant="secondary">
          <Home className="w-5 h-5 mr-2" />
          {session?.location?.name || "Select Location"}
        </Button>
      )}
      <DialogContent className="max-w-[90%] sm:max-w-md">
        <DialogHeader className="text-left pb-4">
          <DialogTitle className="text-xl">Change Location</DialogTitle>
          <DialogDescription>
            Click on the locations below to manage data for that location.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup
          defaultValue={session?.location?.id}
          className="space-y-2 mb-4"
          onValueChange={onChange}
        >
          {/* {locations?.map((item: any) => (
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

          {(!locations || locations?.length == 0) && (
            <div>No Location Found</div>
          )} */}
        </RadioGroup>
        <CreateLocation
          trigger={
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" /> New
                  </>
                )}
              </Button>
            </DialogTrigger>
          }
        ></CreateLocation>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;
