"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { authClient } from "@/lib/auth-client";

interface TeamCreatedSuccessContentProps {
  teamId: number;
  teamSlug: string;
}

export function TeamCreatedSuccessContent({
  teamId,
  teamSlug,
}: TeamCreatedSuccessContentProps) {
  const router = useRouter();
  const [isSettingActive, setIsSettingActive] = useState(false);

  const handleGoToHome = async () => {
    if (isSettingActive) return;

    try {
      setIsSettingActive(true);

      // Set the newly created team as active
      const { error } = await authClient.organization.setActive({
        organizationId: teamId.toString(),
        organizationSlug: teamSlug,
      });

      if (error) {
        toast.error("Failed to set team as active", {
          description: error.message,
        });
        return;
      }

      // Redirect to bots page
      router.push("/bots");
    } catch (error) {
      console.error("Error setting team as active:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSettingActive(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <GradientIcon color="var(--color-background)" size="xl">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </GradientIcon>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Team Created Successfully!</h1>
          <p className="text-sm text-muted-foreground">
            Your new team has been created. You can now start using your new
            team to manage your bots and workflows.
          </p>
        </div>
        <Button
          onClick={handleGoToHome}
          disabled={isSettingActive}
          className="w-full"
          size="lg"
        >
          {isSettingActive ? "Setting up..." : "Go to Home"}
        </Button>
      </div>
    </div>
  );
}
