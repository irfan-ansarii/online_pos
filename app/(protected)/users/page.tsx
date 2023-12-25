import React from "react";
import { User } from "@prisma/client";
import { getUsers } from "@/actions/user-actions";

import UserCard from "./componets/UserCard";
import Pagination from "@/components/shared/pagination";

interface SearchParamsProps {
  [key: string]: string;
}
interface ResponseProps {
  data: User[];
  pagination: { page: number; pageCount: number };
}

const UserPage = async ({
  searchParams,
}: {
  searchParams: SearchParamsProps;
}) => {
  const { data, pagination }: ResponseProps = await getUsers(searchParams);
  return (
    <>
      <div className="grid grid-cols-1 md:gap-2 items-center">
        {data?.map((user: User) => (
          <UserCard user={user} key={user.id} />
        ))}
      </div>
      <div className="flex items-center justify-center mt-auto">
        <Pagination className="mt-6" pagination={pagination} />
      </div>
    </>
  );
};

export default UserPage;
