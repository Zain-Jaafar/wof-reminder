"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { Mail01Icon } from "@/lib/icons";

export default function WaitlistFormInline() {
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
    <div className="max-w-md">
      {status === "success" ? (
        <div className="text-center py-6 bg-green-50 rounded-lg border border-green-200">
          <div className="text-green-500 text-4xl mb-3">✓</div>
          <h3 className="text-lg font-bold mb-2">You&apos;re on the list!</h3>
          <p className="text-foreground text-sm">
            We&apos;ll notify you when RoadworthyTracker launches.
          </p>
        </div>
      ) : (
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <Input
              type="text"
              name="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={status === "loading"}
              className="bg-white/90 backdrop-blur-sm"
            />
          </div>

          <div>
            <Input
              type="email"
              name="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === "loading"}
              className="bg-white/90 backdrop-blur-sm"
            />
          </div>

          <div>
            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
              disabled={status === "loading"}
            >
              <Icon icon={Mail01Icon} size={18} className="mr-2" />
              {status === "loading" ? "Joining..." : "Get Early Access"}
            </Button>
          </div>

          {status === "error" && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
              {errorMessage}
            </div>
          )}
        </form>
      )}
    </div>
  );
}