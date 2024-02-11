import React from "react";
import { getSale } from "@/actions/sale-actions";
import { getPayments } from "@/actions/payments-actions";

import Actions from "./components/actions";
import CustomerCard from "./components/customer-card";
import NotesCard from "./components/notes-card";
import TotalCard from "./components/total-card";
import ShipmentCard from "./components/shipment-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LineItem from "./components/line-item";

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
              {/* line items */}
              {sale.lineItems.length > 0 && (
                <Card className="border rounded-md">
                  <CardHeader className="border-b">
                    <CardTitle className="text-base">Products</CardTitle>
                  </CardHeader>

                  <CardContent className="divide-y">
                    {sale.lineItems?.map((field: any) => (
                      <LineItem key={field.id} field={field} />
                    ))}
                  </CardContent>
                </Card>
              )}
              {/* processing */}
              {sale.shipments.map((shipment, i) => (
                <ShipmentCard shipment={shipment} key={`item-${i}`} />
              ))}

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
