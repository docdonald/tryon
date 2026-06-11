"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
}

export const AuroraBackground = ({
  className,
  children,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col min-h-[100vh] bg-white text-[#111111]",
          className
        )}
        {...props}
      >
        {/* Subtle radial gradient for depth */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] opacity-[0.025]"
            style={{ background: 'radial-gradient(ellipse at top, #000000 0%, transparent 70%)' }}
          />
        </div>
        
        {children}
      </div>
    </main>
  );
};
