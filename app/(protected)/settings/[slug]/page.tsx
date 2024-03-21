import React, { lazy } from "react";

const Application = lazy(() => import("../components/application"));
const Sale = lazy(() => import("../components/sale"));
const Purchase = lazy(() => import("../components/purchase"));
const SaleInvoice = lazy(() => import("../components/sale-invoice"));
const PurchaseInvoice = lazy(() => import("../components/purchase-invoice"));
const Barcode = lazy(() => import("../components/barcode"));
const Notifications = lazy(() => import("../components/notifications"));
const EmailMessage = lazy(() => import("../components/email-message"));
const page = ({ params }: { params: { slug: string } }) => {
  switch (params.slug) {
    case "application":
      return <Application />;
    case "sale":
      return <Sale />;
    case "purchase":
      return <Purchase />;
    case "sale-invoice":
      return <SaleInvoice />;
    case "purchase-invoice":
      return <PurchaseInvoice />;

    case "notifications":
      return <Notifications />;

    default:
      return <div>{params.slug}</div>;
  }
};

export default page;
