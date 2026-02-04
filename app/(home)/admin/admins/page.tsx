import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Admins",
  description: "Manage admin users",
});

const AdminAdminsView = dynamic(
  () =>
    import("@/components/admin/admins/view").then((mod) => ({
      default: mod.AdminAdminsView,
    })),
  {
    loading: () => <Spinner />,
  },
);

export default function AdminAdminsPage() {
  return (
    <section>
      <Suspense fallback={<Spinner />}>
        <AdminAdminsView />
      </Suspense>
    </section>
  );
}
