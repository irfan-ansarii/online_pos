import React from "react";

const BarPlaceholder = ({ loading = false }: { loading?: boolean }) => {
  return (
    <div
      className={`grid grid-cols-7 gap-10 h-[320px] [&>div]:rounded-t-md [&>div]:bg-secondary items-end relative ${loading ? "animate-pulse" : ""}`}
    >
      {!loading && (
        <span className="absolute flex inset-x-0 inset-y-0 items-center justify-center">
          No Data
        </span>
      )}
      <div className="h-full"></div>
      <div className="h-2/3"></div>
      <div className="h-2/5"></div>
      <div className="h-1/2"></div>
      <div className="h-full"></div>
      <div className="h-2/3"></div>
      <div className="h-2/5"></div>
    </div>
  );
};

export default BarPlaceholder;
