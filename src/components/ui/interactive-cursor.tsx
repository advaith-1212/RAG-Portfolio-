"use client";
import React, { useState, useEffect, memo } from "react";
import { motion, useMotionValue } from "framer-motion";

interface InteractiveCursorProps {
  color?: string;
  size?: number;
  hoverSize?: number;
  ringSize?: number;
  hoverRingSize?: number;
  ringColor?: string;
  hoverElements?: string;
}

const InteractiveCursorComponent: React.FC<InteractiveCursorProps> = ({
  color = "rgba(56, 189, 248, 0.7)",  // Cyan with opacity
  size = 8,
  hoverSize = 12,
  ringSize = 32,
  hoverRingSize = 48,
  ringColor = "rgba(56, 189, 248, 0.3)",
  hoverElements = "a, button, [role='button'], input, select, textarea, .hover-target",
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = "none";
    
    // Throttle function for better performance
    const throttle = (func: Function, limit: number) => {
      let lastFunc: number;
      let lastRan: number = 0;
      
      return function(this: any, ...args: any[]) {
        const context = this;
        const now = Date.now();
        if (now - lastRan >= limit) {
          func.apply(context, args);
          lastRan = now;
        } else {
          clearTimeout(lastFunc);
          lastFunc = window.setTimeout(() => {
            if (Date.now() - lastRan >= limit) {
              func.apply(context, args);
              lastRan = Date.now();
            }
          }, limit - (now - lastRan));
        }
      };
    };
    
    const handleMouseMove = throttle((e: MouseEvent) => {
      // Use direct DOM updates for immediate response
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      if (!isVisible) setIsVisible(true);
      
      // Check if hovering over interactive elements - less frequently
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element && element.matches(hoverElements)) {
        if (!isHovering) setIsHovering(true);
      } else {
        if (isHovering) setIsHovering(false);
      }
    }, 16); // ~60fps

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      // Restore default cursor
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, hoverElements, mouseX, mouseY, isHovering]);

  const currentSize = isHovering ? hoverSize : size;
  const currentRingSize = isHovering ? hoverRingSize : ringSize;

  return (
    <>
      {/* Inner circle */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50 mix-blend-difference will-change-transform"
        style={{
          backgroundColor: color,
          height: currentSize,
          width: currentSize,
          x: mouseX,
          y: mouseY,
          translateX: `-50%`,
          translateY: `-50%`,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "tween",
          ease: "backOut",
          duration: 0.2,
        }}
      />

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border pointer-events-none z-50 will-change-transform"
        style={{
          borderColor: ringColor,
          height: currentRingSize,
          width: currentRingSize,
          x: mouseX,
          y: mouseY,
          translateX: `-50%`,
          translateY: `-50%`,
          opacity: isVisible ? 1 : 0,
          borderWidth: isHovering ? "2px" : "1px",
        }}
        transition={{
          type: "tween",
          ease: "backOut",
          duration: 0.25,
        }}
      />
    </>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const InteractiveCursor = memo(InteractiveCursorComponent); 