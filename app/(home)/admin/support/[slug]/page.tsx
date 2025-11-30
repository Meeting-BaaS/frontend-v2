import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminTicketDetailsServer } from "@/components/admin/support/details-server";
import { Spinner } from "@/components/ui/spinner";
import { ticketSlugRequestParamsSchema } from "@/lib/schemas/support";

interface AdminTicketDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function AdminTicketDetailsPage({
  params,
}: AdminTicketDetailsPageProps) {
  const requestParams = await params;

  // Parse and validate the request params
  const { success, data: validatedParams } =
    ticketSlugRequestParamsSchema.safeParse(requestParams);
  if (!success) {
    return notFound();
  }

  return (
    <section>
      <Suspense fallback={<Spinner />}>
        <AdminTicketDetailsServer ticketId={validatedParams.slug} />
      </Suspense>
    </section>
  );
}
