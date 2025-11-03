import { cookies } from "next/headers";
import { BillingContent } from "@/components/settings/billing/content";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_BILLING_INFO } from "@/lib/api-routes";
import {
  type BillingInfoResponse,
  billingInfoResponseSchema,
} from "@/lib/schemas/settings";

export async function BillingTab() {
  const cookieStore = await cookies();

  // Fetch billing info
  const billingInfoResponse = await axiosGetInstance<BillingInfoResponse>(
    GET_BILLING_INFO,
    billingInfoResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  return <BillingContent billingInfo={billingInfoResponse.data} />;
}
