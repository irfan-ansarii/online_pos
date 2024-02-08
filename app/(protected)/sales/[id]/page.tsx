import React from "react";
import { getSale } from "@/actions/sale-actions";

import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertOctagon,
  BadgeCheck,
  ChevronDown,
  Clock,
  Download,
  PenSquare,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Numeral from "numeral";
import { Button } from "@/components/ui/button";
import { AvatarItem } from "@/components/shared/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { format } from "date-fns";
import { Transaction } from "@prisma/client";
import { Input } from "@/components/ui/input";
import LineItem from "./components/line-item";
import CustomerCard from "./components/customer-card";
import NotesCard from "./components/notes-card";
import TotalCard from "./components/total-card";
interface Props {
  params: {
    id: string;
  };
}

const SalePage = async ({ params: { id } }: Props) => {
  const parsedId = parseInt(id);

  const { data: sale } = await getSale(parsedId);

  return (
    <div className="grow">
      {/* header */}
      <div className="relative border-b bg-background">
        <div className="h-[50px] md:h-[60px] flex w-full items-center px-4 md:px-6 relative bg-background">
          <div className="text-lg font-semibold">{sale.title}</div>
        </div>
      </div>

      {/* content */}
      <div className="p-4 gap-4 md:p-6">
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          <div className="col-span-3 lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {/* processing */}
              <Card className="border rounded-md">
                <CardHeader>
                  <CardTitle className="text-base flex items-center mb-3">
                    Processing
                    <Clock className="w-4 h-4 ml-2 text-warning" />
                  </CardTitle>
                  <Input className="bg-secondary" placeholder="Search..." />
                </CardHeader>

                <div className="p-4 pt-0 space-y-2">
                  {sale?.lineItems?.map((field: any) => (
                    <LineItem key={field.id} field={field} />
                  ))}
                </div>
                <CardFooter>
                  <Button className="flex w-full">Ship Now</Button>
                </CardFooter>
              </Card>

              {/* processed */}
              <Card className="border rounded-md">
                <CardHeader className="pt-2">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <CardTitle className="text-base">Fulfilled</CardTitle>
                      <BadgeCheck className="w-4 h-4 ml-2 text-success" />
                    </div>

                    <div className="ml-auto mr-2">
                      Trackon Courier:
                      <a
                        href="https://goldysnestt.com"
                        target="_blank"
                        className="ml-1 text-primary underline"
                      >
                        657574536474
                      </a>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground"
                    >
                      <PenSquare className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground"
                    >
                      <Download className="w-5 h-5" />
                    </Button>
                  </div>
                  <Input className="bg-secondary" placeholder="Search..." />
                </CardHeader>

                <div className="space-y-2 p-4 pt-0">
                  {sale?.lineItems?.map((field: any) => (
                    <LineItem key={field.id} field={field} />
                  ))}
                </div>
                <CardFooter>
                  <Button className="flex w-full" variant="destructive">
                    Create Return
                  </Button>
                </CardFooter>
              </Card>

              {/* return */}
              <Card className="border rounded-md">
                <CardHeader className="pt-2">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <CardTitle className="text-base">Returned</CardTitle>
                      <AlertOctagon className="w-4 h-4 ml-2 text-error" />
                    </div>

                    <div className="ml-auto mr-2">
                      Trackon Courier:
                      <a
                        href="https://goldysnestt.com"
                        target="_blank"
                        className="ml-1 text-primary underline"
                      >
                        657574536474
                      </a>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground"
                    >
                      <PenSquare className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground"
                    >
                      <Download className="w-5 h-5" />
                    </Button>
                  </div>
                  <Input className="bg-secondary" placeholder="Search..." />
                </CardHeader>

                <div className="p-4 pt-0 space-y-2">
                  {sale?.lineItems?.map((field: any) => (
                    <LineItem key={field.id} field={field} />
                  ))}
                </div>
              </Card>

              {/* transations */}
              <TotalCard sale={sale} />
            </div>
          </div>

          {/* column-2 */}
          <div className="col-span-3 lg:col-span-1">
            <div className="grid gap-4 md:gap-6">
              <NotesCard sale={sale} />
              <CustomerCard sale={sale} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalePage;
