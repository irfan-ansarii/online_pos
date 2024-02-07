import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Inbox } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}
const AnaliticCard = ({ title, value, icon }: Props) => {
  return (
    <Card className="border rounded-md">
      <CardContent className="flex items-start">
        <div>
          <CardTitle>{value}</CardTitle>
          <CardDescription>10</CardDescription>
        </div>
        <span className="ml-auto bg-red-500 p-3 rounded-full">
          <Inbox className="w-4 h-4" />
        </span>
      </CardContent>
      <CardFooter>
        <CardDescription className="flex w-full items-center">
          {title} <ArrowRight className="w-4 h-4 ml-auto" />
        </CardDescription>
      </CardFooter>
    </Card>
  );
};

export default AnaliticCard;
