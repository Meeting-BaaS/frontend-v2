import { cookies } from "next/headers";
import { AdminBotDetails } from "@/components/admin/bots/details";
import { axiosGetInstance } from "@/lib/api-client";
import { ADMIN_GET_BOT_DETAILS } from "@/lib/api-routes";
import {
  type GetAdminBotDetailsResponse,
  getAdminBotDetailsResponseSchema,
} from "@/lib/schemas/admin";

interface AdminBotDetailsServerProps {
  botId: string;
}

export async function AdminBotDetailsServer({
  botId,
}: AdminBotDetailsServerProps) {
  const cookieStore = await cookies();

  const botDetails = await axiosGetInstance<GetAdminBotDetailsResponse>(
    ADMIN_GET_BOT_DETAILS(botId),
    getAdminBotDetailsResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  return <AdminBotDetails botDetails={botDetails.data} botUuid={botId} />;
}
