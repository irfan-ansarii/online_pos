import React from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileHeader = ({
  title,
  showSearch = true,
  children,
}: {
  title: string;
  showSearch?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <div className="md:hidden sticky top-0 bg-background z-50">
      <header className="h-[60px] border-b shadow">
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
          <div className="justify-self-end flex">
            {showSearch && (
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-transparent"
              >
                <Search className="w-5 h-5" />
              </Button>
            )}

            {children}
          </div>
        </div>
      </header>
    </div>
  );
};

export default MobileHeader;
