import React from "react";
import Loading from "@/components/shared/Loading";

const LoadingPage = () => {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <Loading key={i} />
      ))}
    </>
  );
};

export default LoadingPage;
