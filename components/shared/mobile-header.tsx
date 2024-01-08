"use client";
import React from "react";
import { ArrowLeft, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

const MobileHeader = ({
  title,
  showSearch = true,
  children,
}: {
  title: string;
  showSearch?: boolean;
  children?: React.ReactNode;
}) => {
  const [searchVisible, setSearchVisible] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (searchVisible) {
      inputRef.current?.focus();
    }
  }, [searchVisible]);
  return (
    <div className="md:hidden sticky top-0 bg-background z-50">
      <header className="h-[60px] border-b shadow px-2 relative">
        <div className="flex h-full w-full items-center justify-between relative">
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
          <div className="flex items-center">
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-transparent"
              onClick={() => setSearchVisible(!searchVisible)}
            >
              {searchVisible ? (
                <X className="w-5 h-5" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>
          </div>
          {/* search panel */}
          {searchVisible && (
            <div className="absolute inset-y-0 left-10 right-10 flex items-center">
              <div className="relative w-full">
                <Input
                  ref={inputRef}
                  className="w-full border-none pl-0 focus-visible:ring-transparent"
                  placeholder="Search..."
                />
                <span className="absolute inline-flex justify-center items-center inset-y-0 right-12">
                  {children}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default MobileHeader;
