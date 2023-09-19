import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Plus, Minus, Trash2 } from "lucide-react";
const Page = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-7 border">Products</div>
      <div className="col-span-5 border mt-[-75px] mr-[-15px] h-screen z-50 bg-popover">
        <div className="flex flex-col h-full w-full p-4 rounded-l sticky relative">
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

          <ScrollArea className="grow my-2 h-full -mx-4 px-4">
            <Accordion type="single" collapsible className="h-full">
              {[...Array(20)].map((val, i) => (
                <AccordionItem value={`item-${i}`}>
                  <div className="grid grid-cols-12 items-center relative group">
                    <div className="flex gap-2 col-span-7">
                      <AccordionTrigger className="py-1">
                        <Avatar className="mr-2 w-8 h-8">
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="@shadcn"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-sm font-normal block">
                            Is it accessible?
                          </span>
                          <span className="text-sm font-normal block">
                            Is it accessible?
                          </span>
                        </div>
                      </AccordionTrigger>
                    </div>
                    <div className="col-span-5 grid grid-cols-12">
                      <div className="flex col-span-5">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full w-6 h-6"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="grow text-center shrink-0">4</span>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="rounded-full w-6 h-6"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="col-span-7 text-right">
                        total
                        <span className="inset-y-0 h-full flex items-center absolute -right-0 opacity-0 group-hover:opacity-100 transition duration-500">
                          <Button variant="destructive" size="icon">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </span>
                      </div>
                    </div>
                  </div>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>

          <div>
            <div className="divide-y flex flex-col border-y text-sm">
              <div className="flex justify-between py-1">
                <div>Subtotal</div>
                <div>0.00</div>
              </div>
              <div className="flex justify-between py-1">
                <div>Discount</div>
                <div>0.00</div>
              </div>
              <div className="flex justify-between py-1">
                <div>Tax</div>
                <div>0.00</div>
              </div>
              <div className="flex justify-between py-1">
                <div>Total</div>
                <div>0.00</div>
              </div>
            </div>
            <div className="mt-2">
              <Button className="w-full">Proceed</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
