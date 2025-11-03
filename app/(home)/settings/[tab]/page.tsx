import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { BillingTab } from "@/components/settings/billing/tab-server";
import { UsageTab } from "@/components/settings/usage/tab-server";
import { Spinner } from "@/components/ui/spinner";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_SESSION } from "@/lib/api-routes";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";
import { settingsPageTabsSchema } from "@/lib/schemas/settings";

interface SettingsTabPageProps {
  params: Promise<{ tab: string }>;
}

export default async function SettingsTabPage({
  params,
}: SettingsTabPageProps) {
  const { tab } = await params;

  // Validate tab using Zod
  const validation = settingsPageTabsSchema.safeParse(tab);
  if (!validation.success) {
    return notFound();
  }

  // Redirect if user is not logged in
  const cookieStore = await cookies();
  const session = await axiosGetInstance<SessionResponse>(
    GET_SESSION,
    sessionResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );
  const redirectSearchParams = new URLSearchParams();
  redirectSearchParams.set("redirectTo", `/settings/${tab}`);
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`);
  }

  // Render the appropriate tab content
  let TabContent: React.ReactNode;

  switch (tab) {
    case "usage":
      TabContent = <UsageTab />;
      break;
    case "billing":
      TabContent = <BillingTab />;
      break;
    case "team":
    case "emails":
    case "integrations":
      TabContent = (
        <div className="text-muted-foreground py-10 text-center">
          {tab.charAt(0).toUpperCase() + tab.slice(1)} settings coming soon...
        </div>
      );
      break;
    default:
      return notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-10">
          <Spinner className="size-6" />
        </div>
      }
    >
      {TabContent}
    </Suspense>
  );
}
