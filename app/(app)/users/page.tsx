import React from "react";
import MobileHeader from "@/components/shared/mobile-header";
import UserCard from "./componets/UserCard";
import PageHeader from "./componets/PageHeader";
import AddUserDialog from "./componets/AddUserDialog";

const Page = () => {
  return (
    <div>
      <MobileHeader title="Users" />
      <main className="grow">
        <PageHeader />
        <div className="md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-4">
            {[...Array(18)].map(() => (
              <UserCard />
            ))}
          </div>
        </div>
        <AddUserDialog className="md:hidden" />
      </main>
    </div>
  );
};

export default Page;
