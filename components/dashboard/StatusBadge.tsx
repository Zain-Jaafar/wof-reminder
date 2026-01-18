import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import {
  CheckmarkCircle01Icon,
  Clock03Icon,
  CancelCircleIcon,
} from "@/lib/icons";
import { getStatus } from "@/lib/utils";

interface StatusBadgeProps {
  expiryTimestamp: number;
}

const iconMap = {
  CheckmarkCircle01Icon,
  Clock03Icon,
  CancelCircleIcon,
} as const;

export function StatusBadge({ expiryTimestamp }: StatusBadgeProps) {
  const status = getStatus(expiryTimestamp);

  return (
    <Badge
      variant={
        status.variant as "success" | "warning" | "destructive"
      }
    >
      <Icon
        icon={iconMap[status.icon]}
        size={14}
        className="mr-1"
      />
      {status.status}
    </Badge>
  );
}
