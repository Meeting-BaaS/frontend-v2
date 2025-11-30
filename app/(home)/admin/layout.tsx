import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_SESSION } from "@/lib/api-routes";
import {
  type SessionResponse,
  sessionResponseSchema,
} from "@/lib/schemas/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  // Redirect if user is not logged in
  if (!session) {
    return redirect("/sign-in?redirectTo=/admin/bots");
  }

  // Redirect if user is not admin
  if (session.user.role !== "admin") {
    return redirect("/bots");
  }

  return <>{children}</>;
}
