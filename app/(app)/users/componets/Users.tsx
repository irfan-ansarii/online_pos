"use client";

import React from "react";
import UserCard from "./UserCard";
import Loading from "./Loading";
import { useUsers } from "@/hooks/useUser";
import EmptyBox from "@/components/shared/empty-box";
import ErrorBox from "@/components/shared/error-box";
const Users = () => {
  const { data: users, isLoading, isError, error } = useUsers({});

  return (
    <>
      {/* loading */}

      {isLoading && [...Array(6)].map((_, i) => <Loading key={i} />)}

      {/* pages */}

      {users?.pages.map((page) => {
        // cards
        page.data.data.map((user: any) => (
          <UserCard user={user} key={user.id} />
        ));

        //  empty data
        {
          page.data.data.length == 0 && (
            <EmptyBox
              className="col-span-1 md:col-span-2 xl:col-span-3"
              title="No Users Found"
            />
          );
        }
      })}

      {/* error */}
      {isError && (
        <ErrorBox
          className="col-span-1 md:col-span-2 xl:col-span-3"
          title={error?.response?.data?.message}
        />
      )}
    </>
  );
};

export default Users;
