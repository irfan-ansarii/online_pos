"use client";
import React from "react";
import { PenSquare } from "lucide-react";

import { useToggle } from "@uidotdev/usehooks";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NotesDialog from "./notes-dialog";

const NotesCard = ({ sale }: any) => {
  const [open, toggle] = useToggle(false);
  return (
    <Card className="border rounded-md">
      <CardHeader className="pb-0">
        <div className="flex items-center">
          <CardTitle className="text-base">Notes</CardTitle>
          <Button
            size="icon"
            variant="ghost"
            className="w-auto h-auto ml-auto"
            onClick={() => toggle(true)}
          >
            <PenSquare className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="whitespace-pre-wrap">
          {sale.notes}
        </CardDescription>
      </CardContent>

      {open && (
        <NotesDialog
          open={open}
          toggle={toggle}
          saleId={sale.id}
          notes={sale.notes}
        />
      )}
    </Card>
  );
};

export default NotesCard;
