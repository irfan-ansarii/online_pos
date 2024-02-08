import React from "react";
import { PenSquare } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const CustomerCard = ({ sale }: any) => {
  const { id, customerId, billingAddress, shippingAddress } = sale;

  return (
    <Card className="border rounded-md">
      <CardContent>
        <div className="flex justify-between mb-1">
          <CardTitle className="text-base">Customer</CardTitle>
          <PenSquare className="w-4 h-4 text-muted-foreground" />
        </div>

        <div className="text-muted-forreground">
          <div> {shippingAddress?.name}</div>
          <div> {shippingAddress?.phone}</div>
          <div> {shippingAddress?.email}</div>
        </div>
      </CardContent>
      <CardContent>
        <div className="flex justify-between mb-1">
          <CardTitle className="text-base">Shipping Address</CardTitle>
          <PenSquare className="w-4 h-4 text-muted-foreground" />
        </div>
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
        <div className="flex justify-between mb-1">
          <CardTitle className="text-base">Billing Address</CardTitle>
          <PenSquare className="w-4 h-4 text-muted-foreground" />
        </div>
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
