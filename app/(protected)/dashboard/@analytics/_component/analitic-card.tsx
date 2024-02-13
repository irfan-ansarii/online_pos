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
  href: string;
  text: string | number;
  subText?: string | number;
  icon: React.ReactNode;
}
const AnaliticCard = ({ title, href, text, subText, icon }: Props) => {
  return (
    <Card className="border rounded-md">
      <CardContent className="flex items-start">
        <div>
          <CardTitle className="mb-2">{text}</CardTitle>
          <CardDescription>{subText}</CardDescription>
        </div>

        {icon}
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
