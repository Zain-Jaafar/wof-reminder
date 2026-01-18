"use client";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import SignIn from "@/components/login/SignIn";
import SignOut from "@/components/login/SignOut";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-8">
      <AuthLoading>Loading...</AuthLoading>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <SignOut />
      </Authenticated>
    </div>
  );
}
