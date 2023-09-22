import React from "react";
import UserCard from "./componets/UserCard";

const Page = () => {
  return (
    <>
      <main className="grow ">
        <div className="md:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-4">
            {[...Array(18)].map(() => (
              <UserCard />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
