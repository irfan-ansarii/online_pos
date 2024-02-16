"use client";

import { Circle } from "rc-progress";

const ProgressChart = ({ percent }: { percent: number }) => {
  return (
    <Circle
      percent={percent}
      strokeWidth={10}
      trailWidth={10}
      className={`[&>circle:first-child]:!stroke-secondary [&>circle:last-child]:!stroke-primary`}
    />
  );
};

export default ProgressChart;
