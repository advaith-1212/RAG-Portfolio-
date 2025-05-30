"use client";
import React, { useRef, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  // Use fewer rows and columns but make them more visible
  const rows = useMemo(() => new Array(40).fill(1), []);
  const cols = useMemo(() => new Array(30).fill(1), []);
  
  // Using brighter color values
  const colors = useMemo(() => [
    "rgb(56 189 248)", // sky-400
    "rgb(244 114 182)", // pink-400
    "rgb(74 222 128)", // green-400
    "rgb(250 204 21)", // yellow-400
    "rgb(248 113 113)", // red-400
    "rgb(192 132 252)", // purple-400
    "rgb(96 165 250)", // blue-400
  ], []);

  // Check if user prefers reduced motion
  const prefersReducedMotion = useReducedMotion();

  // Track active cell position
  const [activeCell, setActiveCell] = useState<{ row: number, col: number } | null>(null);
  // Track hover state for random cells to create ambient animation
  const [randomCells, setRandomCells] = useState<{[key: string]: boolean}>({});
  // Force some cells to always be illuminated for visibility
  const [staticCells, setStaticCells] = useState<{[key: string]: string}>({});

  // Memoize the random color function
  const getRandomColor = useMemo(() => () => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, [colors]);

  // Ref for the container
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initialize some static illuminated cells for visibility
  useEffect(() => {
    const cells: {[key: string]: string} = {};
    // Create a pattern of illuminated cells
    for (let i = 0; i < rows.length; i += 8) {
      for (let j = 0; j < cols.length; j += 8) {
        cells[`${i}-${j}`] = colors[Math.floor(Math.random() * colors.length)];
      }
    }
    setStaticCells(cells);
  }, [rows.length, cols.length, colors]);
  
  // Throttle function for performance
  const throttle = (func: Function, limit: number) => {
    let lastFunc: ReturnType<typeof setTimeout>;
    let lastRan: number = 0;
    
    return function(this: any, ...args: any[]) {
      const now = Date.now();
      if (now - lastRan >= limit) {
        func.apply(this, args);
        lastRan = now;
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        }, limit - (now - lastRan));
      }
    };
  };

  // Add ambient animation with more visible cells
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    // Increase the number of active random cells
    const maxRandomCells = 15;
    
    const interval = setInterval(() => {
      // Only add a new cell if we're under the limit
      if (Object.keys(randomCells).length < maxRandomCells) {
        const row = Math.floor(Math.random() * rows.length);
        const col = Math.floor(Math.random() * cols.length);
        const key = `${row}-${col}`;
        
        setRandomCells(prev => ({
          ...prev,
          [key]: true
        }));
        
        // Keep the cell illuminated longer
        setTimeout(() => {
          setRandomCells(prev => {
            const newState = {...prev};
            delete newState[key];
            return newState;
          });
        }, 1500); // Longer duration for better visibility
      }
    }, 300); // More frequent updates
    
    return () => clearInterval(interval);
  }, [rows.length, cols.length, prefersReducedMotion, randomCells]);

  // Use pointer events with responsive throttling
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = throttle((e: MouseEvent) => {
      // Get the mouse position relative to the document
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Convert to grid coordinates
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Adjust calculation to ensure boxes illuminate across the entire viewport
        const gridWidth = cols.length * 16;
        const gridHeight = rows.length * 8;
        
        // Map viewport coordinates to grid coordinates
        const col = Math.floor((mouseX / viewportWidth) * cols.length);
        const row = Math.floor((mouseY / viewportHeight) * rows.length);
        
        if (row >= 0 && row < rows.length && col >= 0 && col < cols.length) {
          setActiveCell({ row, col });
          
          // Activate a larger area around the cursor for better visibility
          const surroundingCells: {[key: string]: boolean} = {};
          for (let r = row - 3; r <= row + 3; r++) {
            for (let c = col - 3; c <= col + 3; c++) {
              if (r >= 0 && r < rows.length && c >= 0 && c < cols.length) {
                // Create a circular pattern around the cursor
                const distance = Math.sqrt(Math.pow(r - row, 2) + Math.pow(c - col, 2));
                if (distance <= 3) {
                  surroundingCells[`${r}-${c}`] = true;
                }
              }
            }
          }
          
          setRandomCells(prev => ({
            ...prev,
            ...surroundingCells
          }));
        }
      }
    }, 40); // More responsive throttle time

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [prefersReducedMotion, rows.length, cols.length]);

  // Render the grid with enhanced visibility
  const grid = useMemo(() => {
    return rows.map((_, i) => (
      <motion.div
        key={`row` + i}
        className="w-16 h-8 border-l border-slate-700/50 relative"
      >
        {cols.map((_, j) => {
          const cellKey = `${i}-${j}`;
          const isActive = activeCell?.row === i && activeCell?.col === j;
          const isRandomActive = randomCells[cellKey];
          const staticColor = staticCells[cellKey];
          const shouldIlluminate = isActive || isRandomActive || staticColor;
          
          // Only render crosses at specific intervals
          const showCross = j % 8 === 0 && i % 8 === 0;
          
          return (
            <motion.div
              initial={{ backgroundColor: staticColor || "transparent" }}
              animate={{ 
                backgroundColor: shouldIlluminate 
                  ? staticColor || getRandomColor() 
                  : "transparent",
                transition: { duration: shouldIlluminate ? 0 : 0.5 }
              }}
              key={`col` + j}
              className="w-16 h-8 border-r border-t border-slate-700/50 relative grid-cell"
              style={{
                willChange: 'background-color'
              }}
              data-row={i}
              data-col={j}
            >
              {showCross ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="absolute h-6 w-10 -top-[14px] -left-[22px] text-slate-600 stroke-[1px] pointer-events-none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          );
        })}
      </motion.div>
    ));
  }, [rows, cols, activeCell, randomCells, staticCells, getRandomColor]);

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute left-1/2 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] z-0",
        className
      )}
      {...rest}
    >
      {grid}
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export const Boxes = React.memo(BoxesCore); 