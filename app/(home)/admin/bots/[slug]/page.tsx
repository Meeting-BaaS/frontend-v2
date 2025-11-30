import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminBotDetailsServer } from "@/components/admin/bots/details-server";
import { Spinner } from "@/components/ui/spinner";
import { slugRequestParamsSchema } from "@/lib/schemas/common";

interface AdminBotDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function AdminBotDetailsPage({
  params,
}: AdminBotDetailsPageProps) {
  const requestParams = await params;

  // Parse and validate the request params
  const { success, data: validatedParams } =
    slugRequestParamsSchema.safeParse(requestParams);
  if (!success) {
    return notFound();
  }

  return (
    <section>
      <Suspense fallback={<Spinner />}>
        <AdminBotDetailsServer botId={validatedParams.slug} />
      </Suspense>
    </section>
  );
}
