"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { Mail01Icon } from "@/lib/icons";

export default function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const add = useMutation(api.waitlist.add);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await add({ name, email });
      setStatus("success");
      setName("");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to join waitlist",
      );
    }
  };

  return (
    <div className="px-2 md:px-6">
      <div className="bg-secondary rounded-xl p-6 md:p-8">
        {status === "success" ? (
          <div className="text-center py-8">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h3 className="text-xl font-bold mb-2">You&apos;re on the list!</h3>
            <p className="text-foreground">
              We&apos;ll notify you when RoadworthyTracker launches.
            </p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="sr-only">Name</label>
              <Input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full bg-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={status === "loading"}
              />
            </div>

            <div>
              <label className="sr-only">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "loading"}
              />
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={status === "loading"}
              >
                <Icon icon={Mail01Icon} size={20} />
                {status === "loading" ? "Joining..." : "Join the waitlist now!"}
              </Button>
            </div>

            {status === "error" && (
              <div className="text-red-500 text-sm text-center">
                {errorMessage}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
