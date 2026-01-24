import WaitlistCard from "@/components/waitlist/WaitlistCard";
import WaitlistFooter from "@/components/waitlist/WaitlistFooter";

export default function WaitlistPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8">
      <WaitlistCard />
      <WaitlistFooter />
    </div>
  );
}