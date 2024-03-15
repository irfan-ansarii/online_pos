import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Navigations from "./components/navigations";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="md:p-6 flex-1 flex flex-col gap-6">
        <div className="grid grid-cols-12 gap-6">
          <Card className="col-span-12 lg:col-span-3">
            <CardContent>
              <Navigations />
            </CardContent>
          </Card>
          <div className="col-span-12 lg:col-span-9">
            <Card>
              <CardContent className="flex flex-col">{children}</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default layout;
