import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ViewTicketDetails } from "@/components/support/ticket-details";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_SESSION, GET_TICKET_DETAILS } from "@/lib/api-routes";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";
import {
  type GetTicketDetailsResponse,
  getTicketDetailsResponseSchema,
  ticketSlugRequestParamsSchema,
} from "@/lib/schemas/support";

interface TicketDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TicketDetailsPage({
  params,
}: TicketDetailsPageProps) {
  const requestParams = await params;

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
  redirectSearchParams.set(
    "redirectTo",
    `/support-center/${requestParams.slug}`,
  );
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`);
  }

  // Parse and validate the request params
  const { success, data: validatedParams } =
    ticketSlugRequestParamsSchema.safeParse(requestParams);
  if (!success) {
    return notFound();
  }

  const ticketDetailsResponse =
    await axiosGetInstance<GetTicketDetailsResponse>(
      GET_TICKET_DETAILS,
      getTicketDetailsResponseSchema,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
        params: {
          ticketId: validatedParams.slug,
        },
      },
    );

  return <ViewTicketDetails ticketDetails={ticketDetailsResponse.data} />;
}
