import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PageHeading } from "@/components/layout/page-heading";
import { SettingsTabs } from "@/components/settings/tabs-content";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_SESSION, GET_USAGE_STATS } from "@/lib/api-routes";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";
import {
  settingsPageQuerySchema,
  type UsageStatsResponse,
  usageStatsResponseSchema,
} from "@/lib/schemas/settings";

interface SettingsPageProps {
  searchParams: Promise<{
    tab?: string | string[] | undefined;
  }>;
}

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {
  const params = await searchParams;

  // Redirect if user is not logged in
  // It is recommended to verify session on each page
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
  redirectSearchParams.set("redirectTo", "/settings?tab=usage");
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`);
  }

  const { success, data: validatedParams } =
    settingsPageQuerySchema.safeParse(params);

  if (!success) {
    return redirect("/settings?tab=usage");
  }

  // Fetch usage stats
  const usageStatsResponse = await axiosGetInstance<UsageStatsResponse>(
    GET_USAGE_STATS,
    usageStatsResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  return (
    <section>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <PageHeading title="Settings" containerClassName="md:flex-1" />
      </div>
      <div className="mt-6">
        <SettingsTabs
          usageStats={usageStatsResponse.data}
          tab={validatedParams.tab}
        />
      </div>
    </section>
  );
}
