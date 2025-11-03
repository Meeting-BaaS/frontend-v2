import { PageHeading } from "@/components/layout/page-heading";
import { SettingsTabs } from "@/components/settings/settings-tabs";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <section>
      <div className="flex items-center flex-col gap-2 sm:flex-row sm:justify-between">
        <PageHeading title="Settings" containerClassName="md:flex-1" />
      </div>
      <div className="mt-6">
        <SettingsTabs />
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}
