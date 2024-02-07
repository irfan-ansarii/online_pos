import React from "react";
import AnaliticCard from "./_component/analitic-card";
const AnalyticsPage = ({ searchParams }) => {
  return (
    <>
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <AnaliticCard title="Sale" value="5490.00" />
      </div>
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <AnaliticCard title="Purchase" value="5490.00" />
      </div>
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <AnaliticCard title="Inventory" value="5490.00" />
      </div>
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <AnaliticCard title="Purchase" value="5490.00" />
      </div>
    </>
  );
};

export default AnalyticsPage;
