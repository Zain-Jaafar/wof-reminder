import WaitlistCard from "../components/ui/WaitlistCard";
import WaitlistFooter from "../components/ui/WaitlistFooter";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8">
      <WaitlistCard />
      <WaitlistFooter />
    </div>
  );
}
