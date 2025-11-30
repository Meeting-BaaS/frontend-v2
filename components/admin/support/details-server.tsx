import { cookies } from "next/headers";
import { AdminTicketDetails } from "@/components/admin/support/details";
import { axiosGetInstance } from "@/lib/api-client";
import { ADMIN_GET_TICKET_DETAILS } from "@/lib/api-routes";
import {
  type GetAdminTicketDetailsResponse,
  getAdminTicketDetailsResponseSchema,
} from "@/lib/schemas/admin";

interface AdminTicketDetailsServerProps {
  ticketId: string;
}

export async function AdminTicketDetailsServer({
  ticketId,
}: AdminTicketDetailsServerProps) {
  const cookieStore = await cookies();

  const ticketDetails = await axiosGetInstance<GetAdminTicketDetailsResponse>(
    ADMIN_GET_TICKET_DETAILS,
    getAdminTicketDetailsResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      params: {
        ticketId,
      },
    },
  );

  return (
    <AdminTicketDetails
      ticketDetails={ticketDetails.data}
      ticketId={ticketId}
    />
  );
}
