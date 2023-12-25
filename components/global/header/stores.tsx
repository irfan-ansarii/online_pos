"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { changeLocation } from "@/actions/store-actions";

import { Check, ChevronsUpDown, Home, PlusCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { store } from "@/lib/utils";
import { useLocations } from "@/hooks/useLocations";
import { useSession } from "@/hooks/useSession";
import { useAtom } from "jotai";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";

const Stores = () => {
  const [open, setOpen] = React.useState(false);
  const [storeOpen, setStoreOpen] = useAtom(store);
  const router = useRouter();

  const { locations } = useLocations();
  const { session, mutate } = useSession();

  const onChange = async (value: string) => {
    const locationId = Number(value);

    try {
      const res = await changeLocation(locationId);
      toast({
        variant: "success",
        title: `Switched to ${res?.data?.location?.name}`,
      });
      mutate();
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "error",
        title: error.message,
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <span className="inline-flex items-center">
            <Home className="w-4 h-4 mr-2" />
            {session?.location?.name || "Select Store"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search store..." />
          <CommandEmpty>No store found.</CommandEmpty>
          <CommandGroup>
            {locations?.data?.map((store) => (
              <CommandItem
                key={store.id}
                value={`${store.id}`}
                onSelect={onChange}
              >
                <Check
                  className={`w-4 h-4 mr-2 ${
                    session?.location?.id === store.id
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />
                {store.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />

          <CommandGroup>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                setStoreOpen({ ...storeOpen, storeModal: true });
              }}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Store
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Stores;
