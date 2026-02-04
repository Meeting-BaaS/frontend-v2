import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createPageMetadata({
  title: "Settings",
  description: "Manage your account and team settings"
})

export default function SettingsPage() {
  // Redirect to the default tab (usage)
  redirect("/settings/usage")
}
