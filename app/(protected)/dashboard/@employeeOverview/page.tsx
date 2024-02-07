"use client";
import React from "react";

const EmployeePage = () => {
  return (
    <div className="space-y-4">
      {[...Array(4)].map(() => (
        <div>
          <div className="flex justify-between mb-1">
            <span className="">Flowbite</span>
            <span className="text-sm font-medium">45%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: "45%" }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeePage;
