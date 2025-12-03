import { cookies } from "next/headers";
import { Suspense } from "react";
import { BillingContent } from "@/components/settings/billing/content";
import { InvoiceTableServer } from "@/components/settings/billing/table-server";
import { InvoiceTableSkeleton } from "@/components/settings/billing/table-skeleton";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_BILLING_INFO } from "@/lib/api-routes";
import {
  type BillingInfoResponse,
  billingInfoResponseSchema,
  type ListInvoicesRequestQueryParams,
  listInvoicesRequestQuerySchema,
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

  // Parse invoice query params
  const invoiceParamsValidation = listInvoicesRequestQuerySchema.safeParse({
    limit: searchParams.limit,
    starting_after: searchParams.starting_after,
    ending_before: searchParams.ending_before,
  });

  const invoiceParams: ListInvoicesRequestQueryParams =
    invoiceParamsValidation.success
      ? invoiceParamsValidation.data
      : { limit: 10 };

  return (
    <div className="flex flex-col gap-8 mt-10">
      <BillingContent
        billingInfo={billingInfoResponse.data}
        success={success}
      />
      {/* Invoices Section */}
      <div className="flex flex-col pb-8 gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-semibold">Invoices</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            View and download your past invoices.
          </p>
        </div>
        <Suspense
          key={JSON.stringify(invoiceParams) ?? "default"}
          fallback={<InvoiceTableSkeleton />}
        >
          <InvoiceTableServer params={invoiceParams} />
        </Suspense>
      </div>
    </div>
  );
}
