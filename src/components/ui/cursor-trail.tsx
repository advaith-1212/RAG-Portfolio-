"use client";
import React, { useState, useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";

interface TrailDot {
  x: number;
  y: number;
  opacity: number;
  id: number;
}

interface CursorTrailProps {
  color?: string;
  size?: number;
  trailLength?: number;
  minOpacity?: number;
  maxOpacity?: number;
}

const CursorTrailComponent: React.FC<CursorTrailProps> = ({
  color = "rgba(56, 189, 248, 0.6)",
  size = 6,
  trailLength = 8,
  minOpacity = 0.1,
  maxOpacity = 0.6,
}) => {
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const idCounter = useRef(0);
  const frameRef = useRef<number | null>(null);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTime = useRef(0);

  useEffect(() => {
    // Reduce trail length for better performance
    const effectiveTrailLength = Math.min(trailLength, 8);
    
    const handleMouseMove = (e: MouseEvent) => {
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
      
      // Throttle updates for better performance
      const now = Date.now();
      if (now - lastUpdateTime.current > 32) { // ~30fps for trail updates
        if (frameRef.current === null) {
          frameRef.current = requestAnimationFrame(updateTrail);
          lastUpdateTime.current = now;
        }
      }
    };

    const updateTrail = () => {
      frameRef.current = null;
      
      // Add new dot to trail
      const newDot: TrailDot = {
        x: lastMousePosition.current.x,
        y: lastMousePosition.current.y,
        opacity: maxOpacity,
        id: idCounter.current++,
      };
      
      // Update trail with new dot and remove oldest if exceeding trailLength
      setTrail((prevTrail) => {
        const newTrail = [...prevTrail, newDot];
        return newTrail.length > effectiveTrailLength ? newTrail.slice(-effectiveTrailLength) : newTrail;
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setTrail([]);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      if (throttleTimeoutRef.current !== null) {
        clearTimeout(throttleTimeoutRef.current);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, maxOpacity, trailLength]);

  // Calculate opacity for each dot based on its position in the trail
  const getOpacity = (index: number, total: number) => {
    if (total <= 1) return maxOpacity;
    const opacityStep = (maxOpacity - minOpacity) / (total - 1);
    return maxOpacity - (opacityStep * index);
  };

  // Don't render if not visible
  if (!isVisible || trail.length === 0) return null;

  return (
    <>
      {trail.map((dot, index, array) => (
        <motion.div
          key={dot.id}
          className="fixed top-0 left-0 rounded-full pointer-events-none z-40 will-change-transform"
          style={{
            backgroundColor: color,
            height: size - (index * (size / Math.max(array.length, 1))),
            width: size - (index * (size / Math.max(array.length, 1))),
            transform: `translate(${dot.x - (size / 2)}px, ${dot.y - (size / 2)}px)`,
            opacity: getOpacity(index, array.length),
          }}
          initial={{ opacity: maxOpacity }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      ))}
    </>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const CursorTrail = memo(CursorTrailComponent); 