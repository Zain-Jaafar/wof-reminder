import { HugeiconsIcon } from "@hugeicons/react";
import * as FreeIcons from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { ComponentProps, ReactNode } from "react";

interface IconProps extends Omit<ComponentProps<typeof HugeiconsIcon>, "icon"> {
  name: keyof typeof FreeIcons;
  className?: string;
  children?: ReactNode;
  size?: number;
  strokeWidth?: number;
}

const Icon = ({
  name,
  className,
  children,
  size = 24,
  strokeWidth = 2,
  ...props
}: IconProps) => {
  const iconComponent = FreeIcons[name];

  if (!iconComponent) {
    console.warn(
      `Icon "${String(name)}" not found in @hugeicons/core-free-icons`,
    );
    return null;
  }

  return (
    <HugeiconsIcon
      icon={iconComponent}
      size={size}
      strokeWidth={strokeWidth}
      className={cn("inline-block", className)}
      {...props}
    >
      {children}
    </HugeiconsIcon>
  );
};

export { Icon, FreeIcons };
export type { IconProps };
