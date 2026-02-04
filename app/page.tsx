import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createPageMetadata } from "@/lib/metadata"

export const metadata: Metadata = createPageMetadata({
  title: "Home",
  description: "Meeting BaaS Dashboard"
})

export default function Home() {
  return redirect("/bots")
}
