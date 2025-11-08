import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { BillingTab } from "@/components/settings/billing/tab-server";
import { IntegrationsTab } from "@/components/settings/integrations/tab-server";
import { TeamTab } from "@/components/settings/team/tab-server";
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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SettingsTabPage({
  params,
  searchParams,
}: SettingsTabPageProps) {
  const { tab } = await params;
  const searchParamsObj = await searchParams;

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
      TabContent = <UsageTab searchParams={searchParamsObj} />;
      break;
    case "billing":
      TabContent = <BillingTab searchParams={searchParamsObj} />;
      break;
    case "team":
      TabContent = <TeamTab />;
      break;
    case "emails":
      TabContent = (
        <div className="text-muted-foreground py-10 text-center">
          Email settings coming soon...
        </div>
      );
      break;
    case "integrations":
      TabContent = <IntegrationsTab />;
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
