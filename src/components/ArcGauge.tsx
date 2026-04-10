"use client";

import { motion } from "framer-motion";

interface ArcGaugeProps {
  percentage: number;
  label: string;
  resetTime?: string;
  size?: number;
  color?: string;
}

export default function ArcGauge({ 
  percentage, 
  label, 
  resetTime, 
  size = 140, 
  color = "var(--sys-color-primary)" 
}: ArcGaugeProps) {
  const radius = 60;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * Math.PI; // Semi-circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-2" style={{ width: size }}>
      <div className="relative" style={{ width: radius * 2, height: radius + 10 }}>
        {/* Background Track */}
        <svg
          height={radius + 10}
          width={radius * 2}
          className="transform"
        >
          <path
            d={`M ${strokeWidth/2},${radius} A ${normalizedRadius},${normalizedRadius} 0 0,1 ${radius * 2 - strokeWidth/2},${radius}`}
            fill="transparent"
            stroke="var(--sys-color-surface-container-highest)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Progress Arc */}
          <motion.path
            d={`M ${strokeWidth/2},${radius} A ${normalizedRadius},${normalizedRadius} 0 0,1 ${radius * 2 - strokeWidth/2},${radius}`}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className="text-xl font-bold tracking-tighter text-on-surface">
            {Math.round(percentage)}%
          </span>
          {resetTime && (
            <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase">
              {resetTime}
            </span>
          )}
        </div>
      </div>
      
      {/* Label */}
      <span className="mt-2 text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wide text-center">
        {label}
      </span>
    </div>
  );
}
