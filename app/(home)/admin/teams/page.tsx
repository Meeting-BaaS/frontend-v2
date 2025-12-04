import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { listAllTeamsRequestQuerySchema } from "@/lib/schemas/admin";

const AdminTeamsView = dynamic(
  () =>
    import("@/components/admin/teams/view").then((mod) => ({
      default: mod.AdminTeamsView,
    })),
  {
    loading: () => <Spinner />,
  },
);

interface AdminTeamsPageProps {
  searchParams: Promise<{
    searchEmail?: string | string[] | undefined;
  }>;
}

export default async function AdminTeamsPage({
  searchParams,
}: AdminTeamsPageProps) {
  const params = await searchParams;

  const { success, data: validatedParams } =
    listAllTeamsRequestQuerySchema.safeParse(params);

  if (!success) {
    // If params aren't valid, return teams without any filtering/pagination
    return redirect("/admin/teams");
  }

  return (
    <section>
      <Suspense fallback={<Spinner />}>
        <AdminTeamsView params={validatedParams ?? null} />
      </Suspense>
    </section>
  );
}
