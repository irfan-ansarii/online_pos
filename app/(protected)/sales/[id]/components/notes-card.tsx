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
import { Badge } from "@/components/ui/badge";

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
        <div className="flex gap-2 flex-wrap mt-4">
          {sale?.tags?.map((tag: string, i: number) => (
            <Badge
              variant="secondary"
              className="py-1 capitalize"
              key={`${tag}-${i}`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      {open && (
        <NotesDialog
          open={open}
          toggle={toggle}
          saleId={sale.id}
          notes={sale.notes}
          tags={sale.tags}
        />
      )}
    </Card>
  );
};

export default NotesCard;
