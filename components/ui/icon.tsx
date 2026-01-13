import * as React from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cn } from "@/lib/utils";

interface IconProps {
  icon: IconSvgElement;
  size?: number;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

export function Icon({
  icon,
  size = 24,
  className,
  color = "currentColor",
  strokeWidth = 2,
}: IconProps) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      className={cn("inline-flex shrink-0", className)}
      style={{ width: `${size}px`, height: `${size}px` }}
      color={color}
      strokeWidth={strokeWidth}
    />
  );
}
