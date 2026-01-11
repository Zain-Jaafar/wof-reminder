"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { GoogleIcon } from "@/lib/icons";
import { useAuthActions } from "@convex-dev/auth/react";

export default function SignIn() {
  const { signIn } = useAuthActions();

  return (
    <>
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center pt-6">
          <Button
            onClick={() => void signIn("google", { redirectTo: "/dashboard" })}
            variant="default"
            size="lg"
            className="w-full"
          >
            <Icon icon={GoogleIcon} className="mr-2" />
            Sign-in/up with Google
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
