"use client";
import React from "react";

import { Plus } from "lucide-react";
import { useSheetToggle } from "@/hooks/useSheet";

import { Button } from "@/components/ui/button";

const CreateButton = ({
  className,
  text,
}: {
  className?: string;
  text?: string;
}) => {
  const [_, toggle] = useSheetToggle("newSheet");
  return (
    <Button className={className} onClick={toggle}>
      <Plus className="w-5 h-5 mr-1" />
      {text || "Create New"}
    </Button>
  );
};

export default CreateButton;
