import React from "react";
import { DialogContent } from "@/components/ui/dialog";

import Save from "./SaveCartDialog";
import Saved from "./SavedCartsDialog";
import Clear from "./ClearCartDialog";

interface Props {
  content: React.ReactNode;
  onOpenChange: (isOpen: boolean) => void;
}
const DynamicDialogContent: React.FC<Props> = ({ content, onOpenChange }) => {
  let Content = null;

  switch (content) {
    case "hold":
      Content = Save;
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
    <DialogContent>
      {Content ? (
        <Content onOpenChange={onOpenChange} />
      ) : (
        <div>Loading...</div>
      )}
    </DialogContent>
  );
};

export default DynamicDialogContent;
