import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SupportTicketsView } from "@/components/support/view";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_SESSION, LIST_SUPPORT_TICKETS } from "@/lib/api-routes";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";
import {
  type ListSupportTicketsResponse,
  listSupportTicketsResponseSchema,
} from "@/lib/schemas/support";

export default async function SupportCenterPage() {
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
  redirectSearchParams.set("redirectTo", "/support-center");
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`);
  }

  const tickets = await axiosGetInstance<ListSupportTicketsResponse>(
    LIST_SUPPORT_TICKETS,
    listSupportTicketsResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  return (
    <section>
      <SupportTicketsView tickets={tickets.data || []} />
    </section>
  );
}
