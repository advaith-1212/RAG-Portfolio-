import React from "react";
import { MagnetLines } from "@/components/ui/magnet-lines";

function MagnetLinesDemo() {
  return (
    <MagnetLines
      rows={9}
      columns={9}
      containerSize="60vmin"
      lineColor="tomato"
      lineWidth="0.8vmin"
      lineHeight="5vmin"
      baseAngle={0}
      style={{ margin: "2rem auto" }}
    />
  );
}

export { MagnetLinesDemo }; 