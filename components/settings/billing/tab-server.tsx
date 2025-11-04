import { cookies } from "next/headers";
import { BillingContent } from "@/components/settings/billing/content";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_BILLING_INFO } from "@/lib/api-routes";
import {
  type BillingInfoResponse,
  billingInfoResponseSchema,
} from "@/lib/schemas/settings";

interface BillingTabProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function BillingTab({ searchParams }: BillingTabProps) {
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

  // Extract success parameter
  const success = searchParams.success === "true";

  return (
    <BillingContent billingInfo={billingInfoResponse.data} success={success} />
  );
}
