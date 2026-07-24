"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Info } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useUser } from "@/hooks/use-user"
import { axiosPatchInstance } from "@/lib/api-client"
import { UPDATE_TEAM_FEATURES } from "@/lib/api-routes"
import { authClient } from "@/lib/auth-client"
import { genericError, permissionDeniedError } from "@/lib/errors"
import type { UpdateTeamDetails } from "@/lib/schemas/teams"
import { updateTeamDetailsSchema } from "@/lib/schemas/teams"

interface TeamDetailsFormProps {
  teamId: number
  initialName: string
  initialApiOnlyArtifactAccess: boolean
  initialProxyExitCountry?: string[] | null
}

// Curated list of countries Decodo covers for residential/ISP exits. The API
// only format-validates (alpha-2); this list is what the UI offers. "" = no
// pinning (bots use a random exit).
const PROXY_COUNTRIES: { code: string; label: string }[] = [
  { code: "au", label: "Australia" },
  { code: "be", label: "Belgium" },
  { code: "br", label: "Brazil" },
  { code: "ca", label: "Canada" },
  { code: "co", label: "Colombia" },
  { code: "de", label: "Germany" },
  { code: "es", label: "Spain" },
  { code: "fr", label: "France" },
  { code: "gb", label: "United Kingdom" },
  { code: "hk", label: "Hong Kong" },
  { code: "ie", label: "Ireland" },
  { code: "it", label: "Italy" },
  { code: "jp", label: "Japan" },
  { code: "nl", label: "Netherlands" },
  { code: "pl", label: "Poland" },
  { code: "ro", label: "Romania" },
  { code: "se", label: "Sweden" },
  { code: "sg", label: "Singapore" },
  { code: "us", label: "United States" }
]

export function TeamDetailsForm({
  teamId,
  initialName,
  initialApiOnlyArtifactAccess,
  initialProxyExitCountry
}: TeamDetailsFormProps) {
  const { updateActiveTeam, activeTeam } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<UpdateTeamDetails>({
    resolver: zodResolver(updateTeamDetailsSchema),
    defaultValues: {
      name: initialName,
      apiOnlyArtifactAccess: initialApiOnlyArtifactAccess,
      proxyExitCountry: initialProxyExitCountry ?? []
    }
  })

  const {
    formState: { isDirty },
    reset,
    watch,
    setValue
  } = form

  const apiOnlyArtifactAccess = watch("apiOnlyArtifactAccess")
  const proxyExitCountry = watch("proxyExitCountry")

  useEffect(() => {
    reset({
      name: initialName,
      apiOnlyArtifactAccess: initialApiOnlyArtifactAccess,
      proxyExitCountry: initialProxyExitCountry ?? []
    })
  }, [initialName, initialApiOnlyArtifactAccess, initialProxyExitCountry, reset])

  const onSubmit = async (data: UpdateTeamDetails) => {
    if (activeTeam.isMember) {
      toast.error(permissionDeniedError)
      return
    }

    if (isSubmitting) return
    try {
      setIsSubmitting(true)

      const nameChanged = data.name !== initialName
      const artifactAccessChanged = data.apiOnlyArtifactAccess !== initialApiOnlyArtifactAccess
      const initialCountries = [...(initialProxyExitCountry ?? [])].sort()
      const proxyCountryChanged =
        JSON.stringify([...data.proxyExitCountry].sort()) !== JSON.stringify(initialCountries)

      // Perform both updates before updating local state
      const promises: Promise<unknown>[] = []

      if (nameChanged) {
        promises.push(authClient.organization.update({
          organizationId: teamId.toString(),
          data: { name: data.name }
        }))
      }

      if (artifactAccessChanged) {
        promises.push(axiosPatchInstance(UPDATE_TEAM_FEATURES, {
          apiOnlyArtifactAccess: data.apiOnlyArtifactAccess
        }))
      }

      if (proxyCountryChanged) {
        promises.push(axiosPatchInstance(UPDATE_TEAM_FEATURES, {
          // [] clears the pin; the API accepts null
          proxyExitCountry: data.proxyExitCountry.length > 0 ? data.proxyExitCountry : null
        }))
      }

      await Promise.all(promises)

      // Only update local state after all API calls succeed
      updateActiveTeam({
        ...(nameChanged && { name: data.name }),
        ...(artifactAccessChanged && { apiOnlyArtifactAccess: data.apiOnlyArtifactAccess }),
        ...(proxyCountryChanged && { proxyExitCountry: data.proxyExitCountry })
      })

      reset({
        name: data.name,
        apiOnlyArtifactAccess: data.apiOnlyArtifactAccess,
        proxyExitCountry: data.proxyExitCountry
      })

      toast.success("Team settings updated successfully")
    } catch (error) {
      console.error("Error updating team settings", error)
      toast.error(error instanceof Error ? error.message : genericError)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center flex-col sm:flex-row gap-2 w-full">
            <Field>
              <FieldLabel htmlFor="name">Team Name</FieldLabel>
              <Input
                id="name"
                type="text"
                autoComplete="off"
                {...form.register("name")}
                aria-invalid={!!form.formState.errors.name}
              />
              {form.formState.errors.name && (
                <FieldDescription className="text-destructive">
                  {form.formState.errors.name.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="region" className="flex items-center gap-2">
                Region{" "}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      Data is stored in the region specified. Default region is 'eu-west-3' (Paris,
                      France). Additional regions are coming soon.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FieldLabel>
              <Input
                id="region"
                type="text"
                autoComplete="off"
                readOnly
                disabled
                className="w-full md:!w-1/2 lg:!w-2/5"
                value={activeTeam.region || "eu-west-3"}
              />
            </Field>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="apiOnlyArtifactAccess"
              checked={apiOnlyArtifactAccess}
              onCheckedChange={(checked) => {
                setValue("apiOnlyArtifactAccess", checked, { shouldDirty: true })
              }}
              disabled={activeTeam.isMember}
            />
            <Label htmlFor="apiOnlyArtifactAccess" className="flex items-center gap-2 text-sm">
              API-Only Artifact Access
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    When enabled, recordings and related artifacts (transcripts, chat messages)
                    cannot be viewed or downloaded from the dashboard. They can only be accessed via
                    the API. Webhook log payloads will also be hidden. Only team admins can change
                    this setting.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
          </div>
          <Field>
            <FieldLabel className="flex items-center gap-2">
              Bot exit countries
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    Pin the countries your bots join meetings from (their residential proxy exit).
                    Select none to use a random exit. Only affects browser-based bots. Only team
                    admins can change this.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FieldLabel>
            <FieldDescription>
              Picking several regions helps the bot find a working one during a provider outage — if
              your first choice is unavailable, it falls through to the next selected region before
              using a random exit.
            </FieldDescription>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {PROXY_COUNTRIES.map((c) => {
                const checked = (proxyExitCountry ?? []).includes(c.code)
                return (
                  <label key={c.code} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={checked}
                      disabled={activeTeam.isMember}
                      onCheckedChange={(v) => {
                        const current = proxyExitCountry ?? []
                        const next = v
                          ? [...current, c.code]
                          : current.filter((x) => x !== c.code)
                        setValue("proxyExitCountry", next, { shouldDirty: true })
                      }}
                    />
                    {c.label}
                  </label>
                )
              })}
            </div>
          </Field>
          <Button
            variant="primary"
            type="submit"
            size="sm"
            disabled={isSubmitting || !isDirty}
            className="w-full sm:w-fit"
          >
            {isSubmitting ? (
              <>
                <Spinner /> Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
