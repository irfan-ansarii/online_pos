import React from "react";
import Numeral from "numeral";
import { Badge } from "@/components/ui/badge";
import { AvatarItem } from "@/components/shared/avatar";

const LineItem = ({ field }: { field: any }) => {
  return (
    <div
      className="flex px-3 py-2 items-center rounded-md border"
      key={field?.id}
    >
      <AvatarItem src={field?.product?.image?.src} />

      <div className="space-y-0.5 truncate flex-1 mx-3">
        <div className="font-medium truncate">{field?.title}</div>
        <div className="flex w-full gap-4">
          {field?.variantTitle !== "Default" && (
            <Badge className="py-0" variant="secondary">
              {field?.variantTitle}
            </Badge>
          )}
          <div className="text-muted-foreground">
            {Numeral(field?.price).format()} x {field?.quantity}
          </div>
        </div>
      </div>

      <div className="space-y-0.5 text-right pl-4">
        <div className="line-through text-muted-foreground">
          {Number(field?.totalDiscount) > 0
            ? Numeral(field?.totalDiscount).format()
            : null}
        </div>
        <div className="font-medium">{Numeral(field?.total).format()}</div>
        {field?.quantity === 0 && (
          <Badge className="py-0 rounded-md capitalize" variant="destructive">
            Removed
          </Badge>
        )}

        {field?.kind === "return" && field?.quantity !== 0 && (
          <Badge
            className="py-0 px-1.5 rounded-md capitalize"
            variant="destructive"
          >
            Returned
          </Badge>
        )}
      </div>
    </div>
  );
};

export default LineItem;
