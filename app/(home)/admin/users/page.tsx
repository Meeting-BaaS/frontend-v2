import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Users",
  description: "Manage users and access",
});

const AdminUsersView = dynamic(
  () =>
    import("@/components/admin/users/view").then((mod) => ({
      default: mod.AdminUsersView,
    })),
  {
    loading: () => <Spinner />,
  },
);

export default function AdminUsersPage() {
  return (
    <section>
      <Suspense fallback={<Spinner />}>
        <AdminUsersView />
      </Suspense>
    </section>
  );
}
