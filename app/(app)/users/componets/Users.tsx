"use client";
import React from "react";
import UserCard from "./UserCard";
import Loading from "./Loading";
import { useUsers } from "@/hooks/useUser";
import EmptyBox from "@/components/shared/empty-box";
const Users = () => {
  const { data: users, isLoading, isError } = useUsers();

  return (
    <>
      {/* loading */}

      {isLoading && [...Array(6)].map((e, i) => <Loading key={i} />)}

      {/* card */}
      {users?.pages.map((page) =>
        page.data.data.map((user: any) => (
          <UserCard user={user} key={user.id} />
        ))
      )}

      {/* <UserCard /> */}

      {/* empty */}
      <EmptyBox
        className="col-span-1 md:col-span-2 xl:col-span-3"
        title="No Users Found"
      />

      {/* error */}
    </>
  );
};

export default Users;
