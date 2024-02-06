import React from "react";

const DashboardPage = () => {
  return (
    <div className="relative bg-background">
      <div className="h-[50px] md:h-[60px] flex w-full items-center px-4 md:px-6 relative bg-background">
        <div className="text-lg font-semibold">Dashboard</div>
        <div className="absolute right-4 md:right-6 inset-y-0 inline-flex items-center gap-2"></div>
      </div>
    </div>
  );
};

export default DashboardPage;
