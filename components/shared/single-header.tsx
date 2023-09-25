import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const SingleHeader = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="hidden md:block bg-background">
      <div className="h-[60px] border-b shadow px-2">
        <div className="flex h-full w-full items-center justify-between">
          <div className="flex items-center">
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-transparent"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-sm font-medium">{title}</div>
          </div>
          <div className="justify-self-end flex">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default SingleHeader;
