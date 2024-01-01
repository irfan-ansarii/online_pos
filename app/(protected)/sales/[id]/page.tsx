import React from "react";
import { getSale } from "@/actions/sale-actions";

import EditForm from "./components/EditForm";

const page = async ({ params }: { params: { id: number } }) => {
  const { id } = params;
  const { data } = await getSale(id);

  return (
    <main className="grow pb-4 px-1 md:p-4  md:mt-[-4.8rem]">
      <EditForm initialValue={data} />
    </main>
  );
};

export default page;
