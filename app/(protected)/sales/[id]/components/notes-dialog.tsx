import React from "react";
import { updateNotes } from "@/actions/sale-actions";

import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogCancel,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  open: boolean;
  toggle: (value?: boolean) => void;
  saleId: number;
  notes: string | undefined;
}
const NotesDialog = ({ open, toggle, saleId, notes }: Props) => {
  const [value, setValue] = React.useState(notes || "");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const onSubmit = async () => {
    setLoading(true);

    try {
      await updateNotes(saleId, value as string);
      toast({
        title: "Notes saved.",
        variant: "success",
      });
      toggle(false);
      router.refresh();
    } catch (error: any) {
      toast({
        title: error?.message,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent className="gap-8">
        <DialogHeader className="text-left">
          <DialogTitle>Edit Note</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur. Lorem, ipsum dolor.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
        ></Textarea>
        <DialogFooter className="flex-col md:flex-row">
          <DialogCancel className="order-1">Cancel</DialogCancel>
          <Button className="md:order-2 w-28" onClick={onSubmit}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotesDialog;
