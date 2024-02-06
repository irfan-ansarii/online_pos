import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}
const AnaliticCard = ({ title, value, icon }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium mb-4">{title}</CardTitle>

        <CardTitle>{value}</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter>action</CardFooter>
    </Card>
  );
};

export default AnaliticCard;
