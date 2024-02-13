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
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Badge } from "@/components/ui/badge";

interface Props {
  open: boolean;
  toggle: (value?: boolean) => void;
  saleId: number;
  notes: string | undefined;
  tags: string[] | undefined;
}
const NotesDialog = ({ open, toggle, saleId, notes, tags = [] }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      saleId,
      notes: notes || "",
      tags: tags || [],
    },
  });

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = e.target as HTMLInputElement;

      if (e.key === "Enter") {
        e.preventDefault();

        if (!input.value || input.value.length === 0) return;

        const tags = form.getValues("tags");
        tags.push(input.value);
        form.setValue("tags", tags);
        input.value = "";
      }
    },
    []
  );

  const onSubmit = async (values: any) => {
    setLoading(true);

    try {
      await updateNotes(values);
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
      <DialogContent className="gap-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader className="text-left">
              <DialogTitle>Edit Note</DialogTitle>
              <DialogDescription>
                Update the details in the text field below
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Input placeholder="" onKeyDown={handleKeyDown} />

            <div className="flex gap-2 flex-wrap">
              {form.watch("tags").map((tag: string, i: number) => (
                <Badge
                  variant="secondary"
                  className="py-1 capitalize"
                  key={`${tag}-${i}`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <DialogFooter className="flex-col md:flex-row">
              <DialogCancel className="order-1">Cancel</DialogCancel>
              <Button className="md:order-2 md:w-28" type="submit">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NotesDialog;
