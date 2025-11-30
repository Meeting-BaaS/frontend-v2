import { notFound } from "next/navigation";
import { Suspense } from "react";
import { number, object } from "zod";
import { AdminTeamDetailsServer } from "@/components/admin/teams/details-server";
import { Spinner } from "@/components/ui/spinner";
import { integerPreprocess } from "@/lib/schemas/common";

const teamSlugRequestParamsSchema = object({
  slug: integerPreprocess(number().int().positive()),
});

interface AdminTeamDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function AdminTeamDetailsPage({
  params,
}: AdminTeamDetailsPageProps) {
  const requestParams = await params;

  // Parse and validate the request params
  const { success, data: validatedParams } =
    teamSlugRequestParamsSchema.safeParse(requestParams);
  if (!success) {
    return notFound();
  }

  return (
    <section>
      <Suspense fallback={<Spinner />}>
        <AdminTeamDetailsServer teamId={validatedParams.slug} />
      </Suspense>
    </section>
  );
}
