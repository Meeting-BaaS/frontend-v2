import { cookies } from "next/headers";
import { CalendarsTable } from "@/components/calendars/table";
import { axiosGetInstance } from "@/lib/api-client";
import { LIST_CALENDARS } from "@/lib/api-routes";
import {
  type CalendarsListResponse,
  calendarsListResponseSchema,
  type ListCalendarsRequestQueryParams,
} from "@/lib/schemas/calendars";

interface CalendarsTableServerProps {
  params: ListCalendarsRequestQueryParams | null;
}

export async function CalendarsTableServer({
  params,
}: CalendarsTableServerProps) {
  const cookieStore = await cookies();

  const calendarsResponse = await axiosGetInstance<CalendarsListResponse>(
    LIST_CALENDARS,
    calendarsListResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      params: {
        cursor: params?.cursor ?? null,
        account_email: params?.email ?? null,
        calendar_platform: params?.calendarPlatform?.join(",") ?? null,
        status: params?.status?.join(",") ?? null,
      },
    },
  );

  return (
    <CalendarsTable
      calendars={calendarsResponse.data}
      prevCursor={calendarsResponse.prev_cursor}
      nextCursor={calendarsResponse.cursor}
      params={params}
    />
  );
}
