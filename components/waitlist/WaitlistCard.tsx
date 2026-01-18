import WaitlistForm from "@/components/waitlist/WaitlistForm";

export default function WaitlistCard() {
  return (
    <div className="max-w-5xl w-full rounded-3xl bg-background shadow-2xl p-8 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="px-2 md:px-6">
          <p className="text-md text-foreground font-bold">RoadworthyTracker</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-primary leading-tight">
            No more unwanted surprises
          </h1>
          <p className="mt-6 text-foreground max-w-xl">
            Tired of clients not coming over for a WoF in time?
            RoadworthyTracker automatically sends reminders at regular intervals
            so you don&apos;t get any more rushed clients.
          </p>
        </div>

        <WaitlistForm />
      </div>
    </div>
  );
}
