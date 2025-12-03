import { cookies } from "next/headers";
import { UsageContent } from "@/components/settings/usage/content";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_USAGE_STATS } from "@/lib/api-routes";
import {
  type UsageStatsResponse,
  usageStatsResponseSchema,
} from "@/lib/schemas/settings";

interface UsageTabProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function UsageTab({ searchParams }: UsageTabProps) {
  const cookieStore = await cookies();

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
    <UsageContent
      usageStats={usageStatsResponse.data}
      searchParams={searchParams}
    />
  );
}
