import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}
const AnaliticCard = ({ title, value, icon }: Props) => {
  return (
    <Card className="border rounded-md">
      <CardHeader>
        <CardTitle className="text-sm font-medium mb-4">{title}</CardTitle>

        <CardTitle>{value}</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter>
        <CardDescription className="flex w-full items-center">
          View <ArrowRight className="w-4 h-4 ml-auto" />
        </CardDescription>
      </CardFooter>
    </Card>
  );
};

export default AnaliticCard;
