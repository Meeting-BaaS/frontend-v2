import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AccountContent } from "@/components/account/account-content"
import { PageHeading } from "@/components/layout/page-heading"
import { axiosGetInstance } from "@/lib/api-client"
import {
  CHECK_CREDENTIAL_ACCOUNT,
  GET_EMAIL_PREFERENCES,
  GET_SESSION,
  LIST_USER_INVITATIONS
} from "@/lib/api-routes"
import { createPageMetadata } from "@/lib/metadata"
import type {
  CheckCredentialAccountResponse,
  GetEmailPreferencesResponse,
  ListUserInvitationsResponse
} from "@/lib/schemas/account"
import {
  checkCredentialAccountResponseSchema,
  getEmailPreferencesResponseSchema,
  listUserInvitationsResponseSchema
} from "@/lib/schemas/account"
import { type SessionResponse, sessionResponseSchema } from "@/lib/schemas/session"

export const metadata: Metadata = createPageMetadata({
  title: "Account",
  description: "Manage your account"
})

export default async function AccountPage() {
  // Redirect if user is not logged in
  // It is recommended to verify session on each page
  const cookieStore = await cookies()
  const session = await axiosGetInstance<SessionResponse>(GET_SESSION, sessionResponseSchema, {
    headers: {
      Cookie: cookieStore.toString()
    }
  })
  const redirectSearchParams = new URLSearchParams()
  redirectSearchParams.set("redirectTo", "/account")
  if (!session) {
    return redirect(`/sign-in?${redirectSearchParams.toString()}`)
  }

  const [credentialCheck, invitationsResponse, emailPreferencesResponse] = await Promise.all([
    axiosGetInstance<CheckCredentialAccountResponse>(
      CHECK_CREDENTIAL_ACCOUNT,
      checkCredentialAccountResponseSchema,
      {
        headers: {
          Cookie: cookieStore.toString()
        }
      }
    ),
    axiosGetInstance<ListUserInvitationsResponse>(
      LIST_USER_INVITATIONS,
      listUserInvitationsResponseSchema,
      {
        headers: {
          Cookie: cookieStore.toString()
        }
      }
    ),
    axiosGetInstance<GetEmailPreferencesResponse>(
      GET_EMAIL_PREFERENCES,
      getEmailPreferencesResponseSchema,
      {
        headers: {
          Cookie: cookieStore.toString()
        }
      }
    )
  ])

  // Filter only pending invitations
  const pendingInvitations = invitationsResponse.data.filter((inv) => inv.status === "pending")

  return (
    <section>
      <PageHeading title="Account" />
      <AccountContent
        hasCredentialAccount={credentialCheck.data.hasCredentialAccount}
        invitations={pendingInvitations}
        emailPreferences={emailPreferencesResponse.data}
      />
    </section>
  )
}
