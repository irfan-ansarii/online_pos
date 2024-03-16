import React from "react";

const PiePlaceholder = ({ loading = false }: { loading?: boolean }) => {
  return (
    <div className={`px-4 relative ${loading ? "animate-pulse" : ""}`}>
      {!loading && (
        <span className="absolute flex inset-x-0 inset-y-0 items-center justify-center">
          No Data
        </span>
      )}
      <div className="h-[300px] aspect-square  border-[2.5rem] rounded-full"></div>
    </div>
  );
};

export default PiePlaceholder;
