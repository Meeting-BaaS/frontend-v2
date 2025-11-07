import { Suspense } from "react";
import { DeleteTeamDialog } from "@/components/settings/team/delete-team-dialog";
import { InviteMemberDialog } from "@/components/settings/team/invite-member-dialog";
import { MembersTableServer } from "@/components/settings/team/members/table-server";
import { TeamDetailsForm } from "@/components/settings/team/team-details-form";
import { TeamLogoForm } from "@/components/settings/team/team-logo-form";
import { Spinner } from "@/components/ui/spinner";
import type { TeamDetails } from "@/lib/schemas/teams";

interface TeamContentProps {
  team: TeamDetails[number];
}

export function TeamContent({ team }: TeamContentProps) {
  return (
    <div className="flex flex-col gap-8 mt-10">
      {/* Team Information Section */}
      <div className="flex flex-col border-b pb-8 gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-semibold">Overview</h3>
        </div>
        <div className="flex flex-col gap-6 md:items-start">
          <TeamLogoForm teamId={team.id} initialLogoUrl={team.logo} />
          <TeamDetailsForm teamId={team.id} initialName={team.name} />
        </div>
      </div>

      {/* Members Section */}
      <div className="flex flex-col border-b pb-8 gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg md:text-xl font-semibold">Members</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              View and manage team members.
            </p>
          </div>
          <InviteMemberDialog />
        </div>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-10">
              <Spinner className="size-6" />
            </div>
          }
        >
          <MembersTableServer />
        </Suspense>
      </div>

      {/* Delete Team Section */}
      <div className="flex flex-col pb-8 gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-semibold">Delete Team</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Permanently delete the team and all of its data from Meeting BaaS.
          </p>
        </div>
        <DeleteTeamDialog teamName={team.name} />
      </div>
    </div>
  );
}
