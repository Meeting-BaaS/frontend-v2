import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PageHeading } from "@/components/layout/page-heading";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_SESSION } from "@/lib/api-routes";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";

export default async function CalendarsPage() {
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
  redirectSearchParams.set("redirectTo", "/calendars");
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`);
  }

  return (
    <section>
      <PageHeading title="Calendars" />
    </section>
  );
}
