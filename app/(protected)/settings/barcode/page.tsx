import React from "react";

import { getOption } from "@/actions/option-actions";
import Barcode from "../components/barcode";

const page = async () => {
  const { data }: any = await getOption("barcodeLabel");

  const defaultValues = {
    width: data?.value?.width || 0,
    height: data?.value?.height || 0,
    columns: data?.value?.columns || 0,
    gap: data?.value?.gap || 0,
    top: data?.value?.top || 0,
    bottom: data?.value?.bottom || 0,
    left: data?.value?.left || 0,
    right: data?.value?.right || 0,
  };

  return <Barcode defaultValues={defaultValues} />;
};

export default page;
