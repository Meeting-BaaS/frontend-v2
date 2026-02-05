// import { MicrosoftLogo } from "@/components/icons/microsoft"
import { GitHubLogo } from "@/components/icons/github"
import { GoogleLogo } from "@/components/icons/google"
// import { GitLabLogo } from "@/components/icons/gitlab"
// import { ZoomLogo } from "@/components/icons/zoom"
import type { ConfigurationResponse } from "@/lib/schemas/configuration"

export type ProviderName = "google" | "microsoft" | "github" | "gitlab" | "zoom"

interface Provider {
  name: ProviderName
  title: string
  logo: React.ReactNode
  primary?: boolean
  className?: string
}

const allProviders: Provider[] = [
  {
    name: "google",
    title: "Google",
    logo: <GoogleLogo />,
    className: "hover:!bg-google-blue"
  },
  {
    name: "github",
    title: "GitHub",
    logo: <GitHubLogo />,
    className: "hover:!bg-github-green"
  }
]

/** Filter providers by configuration (Google/GitHub only when configured). */
export function getProvidersForConfig(config: ConfigurationResponse["data"] | null): Provider[] {
  if (!config) return allProviders
  return allProviders.filter((p) => {
    if (p.name === "google") return config.isGoogleAuthConfigured
    if (p.name === "github") return config.isGithubAuthConfigured
    return false
  })
}

/** @deprecated Use getProvidersForConfig(config) for auth layout. */
export const providers: Provider[] = allProviders
