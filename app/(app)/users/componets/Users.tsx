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

      {[...Array(6)].map((e, i) => (
        <Loading key={i} />
      ))}

      {/* card */}
      <UserCard />

      {/* empty */}
      <EmptyBox className="col-span-3" title="No Users Found" />
      {/* error */}
    </>
  );
};

export default Users;
