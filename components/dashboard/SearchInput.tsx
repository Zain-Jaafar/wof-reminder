import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Search01Icon } from "@/lib/icons";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="mb-6">
      <div className="relative">
        <Icon
          icon={Search01Icon}
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="text"
          placeholder="Search by name or license plate..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
