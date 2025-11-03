import { redirect } from "next/navigation";

export default function SettingsPage() {
  // Redirect to the default tab (usage)
  redirect("/settings/usage");
}
