"use client";

import { GradientIcon } from "@/components/ui/gradient-icon";

interface TeamAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string;
}

export function TeamAvatar({
  name,
  size = "md",
  className,
  color = "var(--color-baas-primary-700)",
}: TeamAvatarProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <GradientIcon size={size} className={className} color={color}>
      <span className="font-bold uppercase">{initial}</span>
    </GradientIcon>
  );
}
