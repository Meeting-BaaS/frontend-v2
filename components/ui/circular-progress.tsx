"use client";

import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  alwaysGreen?: boolean;
}

export function CircularProgress({
  value,
  max,
  size = 80,
  strokeWidth = 8,
  className,
  showLabel = true,
  alwaysGreen = false,
}: CircularProgressProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on percentage
  const getColor = () => {
    if (alwaysGreen) return "stroke-green-500";
    if (percentage >= 90) return "stroke-red-500";
    if (percentage >= 75) return "stroke-yellow-500";
    return "stroke-green-500";
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <title>Circular Progress</title>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-muted fill-none"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={cn("fill-none transition-all duration-300", getColor())}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      {showLabel && (
        <div className="absolute text-center">
          <div className="text-sm font-semibold">{value}</div>
          <div className="text-xs text-muted-foreground">/ {max}</div>
        </div>
      )}
    </div>
  );
}
