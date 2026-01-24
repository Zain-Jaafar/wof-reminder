import WaitlistFormInline from "@/components/waitlist/WaitlistFormInline";
import WaitlistFooter from "@/components/waitlist/WaitlistFooter";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Content */}
            <div className="text-center lg:text-left">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
                <span className="text-primary font-semibold text-sm">🚗 Vehicle Management, Simplified</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Never Miss a 
                <span className="text-primary"> WOF Renewal</span>
                <br />
                Again
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                The intelligent vehicle management system that automatically reminds your clients when their WOF is due. Stop chasing clients and start focusing on what matters most—your business.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/waitlist">View Full Waitlist</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center lg:justify-start gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Auto Reminders</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Client Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Dashboard Analytics</span>
                </div>
              </div>
            </div>

            {/* Right Side - Integrated Form */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Get Early Access
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Be the first to know when we launch. Join 100+ mechanics already on the waitlist.
                  </p>
                </div>
                <WaitlistFormInline />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <WaitlistFooter />
    </div>
  );
}
