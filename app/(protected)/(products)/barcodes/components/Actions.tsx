"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { createSaleInvoice } from "@/lib/create-sale-invoice";
const Actions = () => {
  // Example usage
  const customerInfo = {
    name: "John Doe",
    address: "123 Main Street, Cityville",
  };

  const items = [
    { description: "Item 1", price: 20.99 },
    { description: "Item 2", price: 15.5 },
    // Add more items as needed
  ];

  const totalAmount = items.reduce((total, item) => total + item.price, 0);

  const create = async () => {
    await createSaleInvoice(customerInfo, items, totalAmount);
    console.log("created");
  };
  return (
    <>
      <Button variant="secondary" onClick={create}>
        <Printer className="w-4 h-4 mr-2" />
        Print
      </Button>
    </>
  );
};

export default Actions;
