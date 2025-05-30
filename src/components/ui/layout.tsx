import React, { ReactNode, memo } from "react";
import { MagnetLines } from "@/components/ui/magnet-lines";

interface LayoutProps {
  children: ReactNode;
}

const LayoutComponent = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen w-full relative bg-slate-950 text-white overflow-hidden">
      {/* Background with mask overlay */}
      <div className="fixed inset-0 w-full h-full bg-slate-950/70 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      
      {/* MagnetLines as background */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
        <MagnetLines 
          rows={15}
          columns={15}
          lineColor="#ED6E52" // coral/orange color
          lineWidth="0.5vmin"
          lineHeight="10vmin"
          baseAngle={-20}
          isBackground={true}
        />
      </div>
      
      {/* Content - ensure it's above the background */}
      <div className="relative z-20 min-h-screen w-full">
        {children}
      </div>
    </div>
  );
};

// Memoize the layout component to prevent unnecessary re-renders
export const Layout = memo(LayoutComponent); 