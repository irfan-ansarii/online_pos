import React, { FC } from "react";
import { Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface BadgeProps {
  items: [];
  className?: string;
  placeholderIcon?: React.ReactNode;
}

const Badge: FC<BadgeProps> = ({ items, className, placeholderIcon }) => {
  const MAX_DISPLAY = 4;

  const renderBadgeItems = () => {
    const displayedItems = items.slice(0, MAX_DISPLAY);

    return displayedItems.map((item, index) => (
      <Avatar className="w-10 h-10 border-2 -ml-2 first:ml-0" key={index}>
        <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
          <ImageIcon className="w-4 h-4" />
        </AvatarFallback>
        <AvatarImage src={`${item.image}`}></AvatarImage>
      </Avatar>
    ));
  };

  const renderRemainingCount = () => {
    const remainingCount = items.length - MAX_DISPLAY;

    if (remainingCount > 0) {
      return (
        <Avatar className="w-10 h-10 border-2 -ml-2 first:ml-0">
          <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
            +{remainingCount}
          </AvatarFallback>
        </Avatar>
      );
    }

    return null;
  };

  return (
    <div className={`badge-container ${className || ""}`}>
      {renderBadgeItems()}
      {renderRemainingCount()}
    </div>
  );
};

export default Badge;
