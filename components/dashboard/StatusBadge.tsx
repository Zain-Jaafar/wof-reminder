import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import {
  CheckmarkCircle01Icon,
  Clock03Icon,
  CancelCircleIcon,
} from "@/lib/icons";
import { getStatus } from "@/lib/utils";

interface StatusBadgeProps {
  expiryDate: Date;
}

const iconMap = {
  CheckmarkCircle01Icon,
  Clock03Icon,
  CancelCircleIcon,
} as const;

export function StatusBadge({ expiryDate }: StatusBadgeProps) {
  const status = getStatus(expiryDate);

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
