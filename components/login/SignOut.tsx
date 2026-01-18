import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useAuthActions } from "@convex-dev/auth/react";

export default function SignOut() {
  const { signOut } = useAuthActions();

  return (
    <>
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center pt-6">
          <Button
            onClick={() => void signOut()}
            variant="default"
            size="lg"
            className="w-full"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
