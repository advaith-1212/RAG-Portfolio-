"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CircleCursorProps {
  color?: string;
  size?: number;
  ringSize?: number;
  ringColor?: string;
  delay?: number;
}

export const CircleCursor: React.FC<CircleCursorProps> = ({
  color = "rgba(124, 58, 237, 0.7)",  // Purple with opacity
  size = 12,
  ringSize = 36,
  ringColor = "rgba(124, 58, 237, 0.3)",
  delay = 0.08,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = "none";
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      // Restore default cursor
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <>
      {/* Inner circle */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-50"
        style={{
          backgroundColor: color,
          height: size,
          width: size,
        }}
        animate={{
          x: mousePosition.x - size / 2,
          y: mousePosition.y - size / 2,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          mass: 0.1,
          stiffness: 800,
          damping: 20,
          restDelta: 0.001,
        }}
      />

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border-2 pointer-events-none z-50"
        style={{
          borderColor: ringColor,
          height: ringSize,
          width: ringSize,
        }}
        animate={{
          x: mousePosition.x - ringSize / 2,
          y: mousePosition.y - ringSize / 2,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          mass: 0.4,
          stiffness: 400,
          damping: 25,
          restDelta: 0.001,
          delay: delay,
        }}
      />
    </>
  );
}; 