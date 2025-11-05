import { cookies } from "next/headers";
import { InvoiceTable } from "@/components/settings/billing/table";
import { axiosGetInstance } from "@/lib/api-client";
import { LIST_INVOICES } from "@/lib/api-routes";
import type {
  InvoicesListResponse,
  ListInvoicesRequestQueryParams,
} from "@/lib/schemas/settings";
import { invoicesListResponseSchema } from "@/lib/schemas/settings";

interface InvoiceTableServerProps {
  params: ListInvoicesRequestQueryParams;
}

export async function InvoiceTableServer({ params }: InvoiceTableServerProps) {
  const cookieStore = await cookies();

  const response = await axiosGetInstance<InvoicesListResponse>(
    LIST_INVOICES,
    invoicesListResponseSchema,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
      params: {
        limit: params.limit,
        starting_after: params.starting_after,
        ending_before: params.ending_before,
      },
    },
  );

  return (
    <InvoiceTable
      invoices={response.data}
      hasMore={response.hasMore}
      params={params}
    />
  );
}
