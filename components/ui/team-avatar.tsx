"use client";

import { GradientIcon } from "@/components/ui/gradient-icon";
import { cn } from "@/lib/utils";

interface TeamAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string;
  textClassName?: string;
}

/**
 * Get avatar color based on the first character of the name
 * Maps to 5 different colors using modulo 5
 */
function getAvatarColor(name: string): string {
  const firstChar = name.charAt(0).toUpperCase();
  const charCode = firstChar.charCodeAt(0);
  const colorIndex = charCode % 5;

  const colors = [
    "var(--color-baas-primary-700)", // Blue
    "var(--color-chart-1)", // Orange
    "var(--color-chart-2)", // Blue-green
    "var(--color-chart-3)", // Purple
    "var(--color-chart-4)", // Yellow
  ];

  return colors[colorIndex];
}

export function TeamAvatar({
  name,
  size = "md",
  className,
  color,
  textClassName,
}: TeamAvatarProps) {
  const initial = name.charAt(0).toUpperCase();
  const avatarColor = color ?? getAvatarColor(name);

  return (
    <GradientIcon size={size} className={className} color={avatarColor}>
      <span className={cn("font-bold uppercase text-white", textClassName)}>
        {initial}
      </span>
    </GradientIcon>
  );
}
