"use client";
import React from "react";

const EmployeePage = () => {
  return (
    <>
      {[...Array(4)].map(() => (
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="">Flowbite</span>
            <span className="text-sm font-medium  dark:text-white">45%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: "45%" }}
            ></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default EmployeePage;
