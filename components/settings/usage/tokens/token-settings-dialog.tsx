"use client";

import { useState } from "react";
import { AutoRefillTokenForm } from "@/components/settings/usage/tokens/auto-refill-token-form";
import { ReminderForm } from "@/components/settings/usage/tokens/reminder-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlans } from "@/hooks/use-plans";
import { useUser } from "@/hooks/use-user";
import type { UsageStats } from "@/lib/schemas/settings";

interface TokenSettingsDialogProps {
  children: React.ReactNode;
  usageStats: UsageStats;
}

export function TokenSettingsDialog({
  children,
  usageStats,
}: TokenSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  // If auto-purchase is disabled but reminder is enabled, show the reminder tab first
  const isAutoPurchaseDisabledButReminderEnabled =
    !usageStats.plan.autoPurchaseEnabled && usageStats.plan.reminderEnabled;
  const [tab, setTab] = useState<string>(
    isAutoPurchaseDisabledButReminderEnabled ? "reminder" : "auto-refill",
  );
  const { tokenPacks, tokenPacksLoading } = usePlans();
  const { user } = useUser();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle>Token Settings</DialogTitle>
          <DialogDescription>
            Configure email reminders and auto-refill when your token balance
            drops below a threshold.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={tab} className="w-full" onValueChange={setTab}>
          <TabsList className="w-full flex gap-2 mb-6">
            <TabsTrigger value="auto-refill">Auto-refill</TabsTrigger>
            <TabsTrigger value="reminder">Reminder</TabsTrigger>
          </TabsList>

          {/* Auto-refill Tab */}
          <TabsContent value="auto-refill" className="space-y-6">
            <AutoRefillTokenForm
              usageStats={usageStats}
              tokenPacks={tokenPacks}
              tokenPacksLoading={tokenPacksLoading}
              onClose={() => setOpen(false)}
            />
          </TabsContent>

          {/* Reminder Tab */}
          <TabsContent value="reminder" className="space-y-6">
            <ReminderForm
              usageStats={usageStats}
              userEmail={user.email}
              onClose={() => setOpen(false)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
