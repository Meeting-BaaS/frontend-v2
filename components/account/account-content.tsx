import Link from "next/link";
import { ChangePasswordForm } from "@/components/account/change-password-form";
import { EmailPreferencesForm } from "@/components/account/email-preferences-form";
import { PendingInvites } from "@/components/account/pending-invites";
import { UserNameForm } from "@/components/account/user-name-form";
import { UserProfileForm } from "@/components/account/user-profile-form";
import type {
  EmailPreference,
  ListUserInvitationsResponse,
} from "@/lib/schemas/account";

interface AccountContentProps {
  hasCredentialAccount: boolean;
  invitations: ListUserInvitationsResponse["data"];
  emailPreferences: EmailPreference[];
}

export function AccountContent({
  hasCredentialAccount,
  invitations,
  emailPreferences,
}: AccountContentProps) {
  return (
    <div className="flex flex-col gap-8 mt-10">
      {/* User Profile Section */}
      <div className="flex flex-col border-b pb-8 gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-semibold">Profile</h3>
        </div>
        <div className="flex flex-col gap-6 md:items-start">
          <UserProfileForm />
          <UserNameForm />
        </div>
      </div>

      {/* Change Password Section */}
      {hasCredentialAccount && (
        <div className="flex flex-col border-b pb-8 gap-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg md:text-xl font-semibold">
              Change Password
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Update your password to keep your account secure.
            </p>
          </div>
          <ChangePasswordForm hasCredentialAccount={hasCredentialAccount} />
        </div>
      )}

      {/* Email Preferences Section */}
      <div className="flex flex-col border-b pb-8 gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-semibold">
            Email Preferences
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Manage your email notification preferences.
          </p>
        </div>
        <EmailPreferencesForm initialPreferences={emailPreferences} />
      </div>

      {/* Pending Invites Section */}
      <div className="flex flex-col border-b pb-8 gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-semibold">Pending Invites</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Accept or reject team invitations.
          </p>
        </div>
        <PendingInvites invitations={invitations} />
      </div>

      {/* Delete Account Section */}
      <div className="flex flex-col pb-8 gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-semibold">Delete Account</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Accounts can only be deleted when there are no more teams still
            associated with it.{" "}
            <Link
              href="/settings/team"
              className="text-primary underline hover:no-underline"
            >
              Please leave all teams
            </Link>{" "}
            before deleting your account.
          </p>
        </div>
      </div>
    </div>
  );
}
