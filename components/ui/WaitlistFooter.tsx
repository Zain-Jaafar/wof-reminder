import { Icon } from "@/components/ui/icon";
import { NewTwitterIcon } from "@hugeicons/core-free-icons";

export default function WaitlistFooter() {
  return (
    <div className="p-8 md:p-18 max-w-5xl w-full flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
      <div className="flex gap-3 items-center">
        <a
          href="https://x.com/thezainjaafar"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow on X (Twitter)"
          className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-muted-foreground hover:scale-105 transition-transform cursor-pointer"
        >
          <Icon icon={NewTwitterIcon} />
        </a>
      </div>

      <div className="text-sm text-primary">
        © RoadworthyTracker {new Date().getFullYear()}. All rights reserved.
      </div>
    </div>
  );
}
