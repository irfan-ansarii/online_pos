import React from "react";
import { PenSquare } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

const NotesCard = ({ sale }: any) => {
  return (
    <Card className="border rounded-md">
      <CardContent>
        <div className="flex justify-between mb-1">
          <CardTitle className="text-base">Notes</CardTitle>
          <PenSquare className="w-4 h-4 text-muted-foreground" />
        </div>
        <CardDescription>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloremque,
          possimus!
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default NotesCard;
