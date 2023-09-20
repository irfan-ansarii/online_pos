import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Plus } from "lucide-react";

import Cart from "./components/Cart";
import CartDrawer from "./components/CartDrawer";
const Page = () => {
  return (
    <div className="grid grid-cols-12 gap-4 mt-[-4.8rem] lg:mr-[-15px]">
      <div className="col-span-12 lg:col-span-6 xl:col-span-7 2xl:col-span-8 bg-background">
        <div className="sticky top-0 z-50 bg-background md:-mx-4 p-4">
          <CartDrawer />
          <div className="relative">
            <Input type="text" className="pl-10" placeholder="Search..." />
            <span className="absolute left-0 inset-y-0 h-full flex items-center justify-center w-10 text-muted-foreground">
              <User className="w-5 h-5" />
            </span>
            <span className="absolute right-0 inset-y-0 h-full flex items-center justify-center text-muted-foreground">
              <Button variant="secondary" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3  md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-4 lg:p-0">
          {[...Array(20)].map(() => (
            <div className="rounded border">
              <div>
                <Avatar className="w-full h-full rounded-t rounded-b-none">
                  <AvatarImage
                    src="https://cdn.shopify.com/s/files/1/0652/3541/9353/files/aria3_200x.jpg?v=1685017009"
                    alt="@shadcn"
                    className="object-cover object-cover"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="p-2">
                <div className="truncate text-sm">Title 86rtfkhgtydgfhfhgy</div>
                <div className="text-sm text-muted-foreground">Price</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden lg:block p-4 lg:col-span-6 xl:col-span-5 2xl:col-span-4 sticky bg-secondary dark:bg-border h-screen top-0 bottom-0 z-50">
        <Cart />
      </div>
    </div>
  );
};

export default Page;
