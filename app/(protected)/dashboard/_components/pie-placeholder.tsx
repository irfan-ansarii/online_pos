import React from "react";

const PiePlaceholder = ({ loading = false }: { loading?: boolean }) => {
  return (
    <div className={`px-4 relative ${loading ? "animate-pulse" : ""}`}>
      {!loading && (
        <span className="absolute flex inset-x-0 inset-y-0 items-center justify-center">
          No Data
        </span>
      )}
      <div className="h-[240px] aspect-square  border-[2rem] rounded-full mx-auto mt-auto"></div>
    </div>
  );
};

export default PiePlaceholder;
