import React from "react";
import { DialogContent } from "@/components/ui/dialog";

import AddCustomer from "./AddCustomer";
import Hold from "./HoldCart";
import Saved from "./SavedCarts";
import Clear from "./ClearCart";

const DynamicDialogContent = ({ content }: { content: string | null }) => {
  let Content = null;

  switch (content) {
    case "add-customer":
      Content = AddCustomer;
      break;
    case "hold":
      Content = Hold;
      break;
    case "saved":
      Content = Saved;
      break;
    case "clear":
      Content = Clear;
      break;
    default:
      break;
  }

  return (
    <DialogContent className="max-w-[90%] sm:max-w-md md:top-[10%]">
      {Content ?  <Content />: <div >Loading...</div>}
    </DialogContent>
  );
};

export default DynamicDialogContent;
