"use client";

import { BarChart3, CreditCard, Plug, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConfiguration } from "@/hooks/use-configuration";

export function SettingsTabs() {
  const pathname = usePathname();
  const currentTab = pathname.split("/").pop() || "usage";
  const { configuration } = useConfiguration();
  const showBilling = configuration?.features?.stripe ?? false;

  return (
    <Tabs value={currentTab}>
      <TabsList className="gap-3 max-w-[90svw] overflow-x-auto">
        <TabsTrigger value="usage" className="gap-2" asChild>
          <Link href="/settings/usage">
            <BarChart3 className="size-4" />
            Usage
          </Link>
        </TabsTrigger>
        {showBilling && (
          <TabsTrigger value="billing" className="gap-2" asChild>
            <Link href="/settings/billing">
              <CreditCard className="size-4" />
              Billing
            </Link>
          </TabsTrigger>
        )}
        <TabsTrigger value="team" className="gap-2" asChild>
          <Link href="/settings/team">
            <Users className="size-4" />
            Team
          </Link>
        </TabsTrigger>
        <TabsTrigger value="integrations" className="gap-2" asChild>
          <Link href="/settings/integrations">
            <Plug className="size-4" />
            Integrations
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
