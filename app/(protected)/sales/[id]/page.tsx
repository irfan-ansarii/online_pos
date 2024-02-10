import React from "react";
import { getSale } from "@/actions/sale-actions";
import { getPayments } from "@/actions/payments-actions";
import Actions from "./components/actions";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  AlertOctagon,
  BadgeCheck,
  Clock,
  Download,
  PenSquare,
  X,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import LineItem from "./components/line-item";
import CustomerCard from "./components/customer-card";
import NotesCard from "./components/notes-card";
import TotalCard from "./components/total-card";
import ShippingDialog from "./components/shipping-dialog";
import { Badge } from "@/components/ui/badge";
import ShipmentCard from "./components/shipment-card";
interface Props {
  params: {
    id: string;
  };
}

const SalePage = async ({ params: { id } }: Props) => {
  const parsedId = parseInt(id);

  const { data: sale } = await getSale(parsedId);
  const { data: payments } = await getPayments({ type: "sale" });
  return (
    <div className="grow">
      {/* header */}
      <Actions sale={sale} payments={payments} />
      {/* content */}
      <div className="p-4 gap-4 md:p-6">
        <div className="grid grid-cols-3 gap-4 md:gap-6">
          <div className="col-span-3 lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {/* processing */}
              <ShipmentCard shipment={sale} />

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
