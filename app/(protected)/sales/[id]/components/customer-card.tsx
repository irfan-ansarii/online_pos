import React from "react";
import { PenSquare } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import CustomerDialog from "./customer-dialog";

const CustomerCard = ({ sale }: any) => {
  const { id, customerId, billingAddress, shippingAddress, customer } = sale;

  return (
    <Card className="border rounded-md">
      <CardContent>
        <div className="flex justify-between mb-1">
          <CardTitle className="text-base">Customer</CardTitle>
          {/* <CustomerDialog
            saleId={sale.id}
            customer={{
              id: sale.customerId,
              billingAddress: sale.billingAddress,
              shippingAddress: sale.shippingAddress,
            }}
          /> */}
        </div>

        <div className="text-muted-forreground">
          <div>
            {customer?.firstName} {customer?.lastName}
          </div>
          <div> {customer?.phone}</div>
          <div> {customer?.email}</div>
        </div>
      </CardContent>
      <CardContent>
        <CardTitle className="text-base mb-2">Shipping Address</CardTitle>

        <div className="text-muted-foreground">
          <div> {shippingAddress?.name}</div>
          <div> {shippingAddress?.address}</div>

          <div>
            {shippingAddress?.city} {shippingAddress?.state}
            {shippingAddress?.pinode}
          </div>

          <div> {shippingAddress?.phone}</div>
          <div> {shippingAddress?.email}</div>
          {shippingAddress?.gstin && (
            <div className="uppercase">GSTIN: {shippingAddress?.gstin}</div>
          )}
        </div>
      </CardContent>
      <CardContent>
        <CardTitle className="text-base mb-2">Billing Address</CardTitle>

        <div className="text-muted-foreground">
          <div> {shippingAddress?.name}</div>
          <div> {shippingAddress?.address}</div>

          <div>
            {shippingAddress?.city} {shippingAddress?.state}
            {shippingAddress?.pinode}
          </div>

          <div> {shippingAddress?.phone}</div>
          <div> {shippingAddress?.email}</div>
          {shippingAddress?.gstin && (
            <div className="uppercase">GSTIN: {shippingAddress?.gstin}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
