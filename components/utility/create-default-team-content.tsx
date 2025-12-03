"use client";

import { LogOut, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { Spinner } from "@/components/ui/spinner";
import { env } from "@/env";
import { axiosPostInstance } from "@/lib/api-client";
import { CREATE_DEFAULT_TEAM } from "@/lib/api-routes";
import { authClient } from "@/lib/auth-client";
import { genericError } from "@/lib/errors";
import { createDefaultTeamResponseSchema } from "@/lib/schemas/teams";

export function CreateDefaultTeamContent() {
  const router = useRouter();
  const [creatingTeam, setCreatingTeam] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleCreateTeam = async () => {
    if (creatingTeam) return;

    try {
      setCreatingTeam(true);

      const response = await axiosPostInstance(
        CREATE_DEFAULT_TEAM,
        undefined,
        createDefaultTeamResponseSchema,
      );

      if (response?.data) {
        // Set the newly created team as active
        const { error: setActiveError } =
          await authClient.organization.setActive({
            organizationId: response.data.teamId.toString(),
            organizationSlug: response.data.teamSlug,
          });

        if (setActiveError) {
          console.error("Error setting active team", setActiveError);
          toast.error(setActiveError.message || genericError);
          // Log out the user - the system will automatically set the latest team on next login
          await authClient.signOut();
          router.push("/sign-in");
          return;
        }

        toast.success("Team created successfully");
        router.push("/bots");
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating team", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setCreatingTeam(false);
    }
  };

  const handleSignOut = async () => {
    if (signingOut) return;

    try {
      setSigningOut(true);
      await authClient.signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setSigningOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deletingAccount) return;

    try {
      setDeletingAccount(true);
      const { error } = await authClient.deleteUser({
        callbackURL: `${env.NEXT_PUBLIC_FRONTEND_BASEURL}/sign-in`,
      });

      if (error) {
        toast.error(error.message || genericError);
        return;
      }

      toast.success(
        "Account deletion verification email sent. Please check your email to confirm.",
      );
    } catch (error) {
      console.error("Error deleting account", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <GradientIcon color="var(--color-background)" size="xl">
            <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-lg">
              <Image
                src="/logo-2.svg"
                alt="Meeting BaaS logo"
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>
          </GradientIcon>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Create New Team</h1>
          <p className="text-sm text-muted-foreground">
            We noticed that your account is not associated with any team. You
            can create a new team or delete your account permanently.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleCreateTeam}
            disabled={creatingTeam || signingOut}
            className="w-full"
            aria-busy={creatingTeam}
          >
            {creatingTeam ? (
              <>
                <Spinner className="size-4" /> Creating...
              </>
            ) : (
              <>
                <Plus className="size-4" /> Create team
              </>
            )}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={creatingTeam || signingOut || deletingAccount}
            className="w-full"
            aria-busy={deletingAccount}
          >
            {deletingAccount ? (
              <>
                <Spinner className="size-4" /> Processing...
              </>
            ) : (
              <>
                <Trash2 className="size-4" /> Delete Account
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={creatingTeam || signingOut}
            className="w-full"
            aria-busy={signingOut}
          >
            {signingOut ? (
              <>
                <Spinner className="size-4" /> Signing out...
              </>
            ) : (
              <>
                <LogOut className="size-4" /> Return to Log In
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
