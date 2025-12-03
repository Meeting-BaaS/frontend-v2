import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AcceptInviteContent } from "@/components/utility/accept-invite-content";
import { AcceptInviteNotFound } from "@/components/utility/accept-invite-not-found";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_INVITATION, GET_SESSION } from "@/lib/api-routes";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";
import {
  acceptInviteSearchParamsSchema,
  type InvitationResponse,
  invitationResponseSchema,
} from "@/lib/schemas/teams";

interface AcceptInvitePageProps {
  searchParams: Promise<{ id?: string | string[] | undefined }>;
}

export default async function AcceptInvitePage({
  searchParams,
}: AcceptInvitePageProps) {
  const params = await searchParams;

  // Validate search params
  const { success, data: validatedParams } =
    acceptInviteSearchParamsSchema.safeParse(params);

  if (!success) {
    // Invalid params, redirect to bots page
    return redirect("/bots");
  }

  // Session check - users must be signed in
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
    `/accept-invitation?id=${validatedParams.id}`,
  );

  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`);
  }

  let invitation: InvitationResponse | null = null;

  try {
    invitation = await axiosGetInstance<InvitationResponse>(
      GET_INVITATION,
      invitationResponseSchema,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
        params: {
          id: validatedParams.id,
        },
      },
    );
  } catch (error) {
    console.error("Error accepting invitation", error);
    return <AcceptInviteNotFound />;
  }

  if (!invitation) {
    return <AcceptInviteNotFound />;
  }

  return <AcceptInviteContent invitation={invitation} />;
}
