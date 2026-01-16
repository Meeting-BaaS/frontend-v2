import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { LogViewer } from "@/components/utility/log-viewer";
import { axiosGetInstance } from "@/lib/api-client";
import { ADMIN_GET_BOT_DETAILS, GET_SESSION } from "@/lib/api-routes";
import {
  type GetAdminBotDetailsResponse,
  getAdminBotDetailsResponseSchema,
} from "@/lib/schemas/admin";
import { slugRequestParamsSchema } from "@/lib/schemas/common";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";

interface LogsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LogsPage({ params }: LogsPageProps) {
  const requestParams = await params;
  const cookieStore = await cookies();

  // Parse and validate the request params
  const { success, data: validatedParams } =
    slugRequestParamsSchema.safeParse(requestParams);
  if (!success) {
    return notFound();
  }

  const botUuid = validatedParams.slug;

  // Session check - users must be signed in
  const session = await axiosGetInstance<SessionResponse>(
    GET_SESSION,
    sessionResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  // Redirect if user is not logged in
  if (!session) {
    return notFound();
  }

  // Check if user is admin
  if (session.user.role !== "admin") {
    return notFound();
  }

  // Fetch admin bot details to get the log file URL
  const botDetails = await axiosGetInstance<GetAdminBotDetailsResponse>(
    ADMIN_GET_BOT_DETAILS(botUuid),
    getAdminBotDetailsResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  // Check if log file URL exists
  if (!botDetails.data.logFileUrl) {
    return notFound();
  }

  return <LogViewer logFileUrl={botDetails.data.logFileUrl} />;
}
