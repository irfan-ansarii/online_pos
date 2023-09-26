import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
const Timeline = () => {
  return (
    <Card className="rounded-none md:rounded-md">
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
        <CardDescription>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="relative border-l">
          {[...Array(4)].map(() => (
            <li className="mb-10 ml-6">
              <span className="absolute w-4 h-4 bg-primary rounded-full -left-2 ring-white ring-primary/40 bg-primary"></span>
              <h3 className="font-medium">Flowbite Application UI v2.0.0</h3>
              <time className="block mb-2 font-normal text-muted-foreground">
                Released on January 13th, 2022
              </time>
              <p className="mb-4">Get access to over 20+</p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};

export default Timeline;
