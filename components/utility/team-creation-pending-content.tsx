"use client";

import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GradientIcon } from "@/components/ui/gradient-icon";

export function TeamCreationPendingContent() {
  const router = useRouter();

  const handleGoToHome = () => {
    router.push("/bots");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <GradientIcon color="var(--color-background)" size="xl">
            <Clock className="h-10 w-10 text-amber-600 dark:text-amber-400" />
          </GradientIcon>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Team Creation in Progress</h1>
          <p className="text-sm text-muted-foreground">
            We are waiting for a confirmation on your payment. It can take up to
            10 mins for it to be completed. Once the payment is confirmed, your
            team will appear in your dashboard.
          </p>
        </div>
        <Button onClick={handleGoToHome} className="w-full" size="lg">
          Go to Home
        </Button>
      </div>
    </div>
  );
}
