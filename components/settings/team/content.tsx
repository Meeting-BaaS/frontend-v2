import { Suspense } from "react";
import { DeleteTeamDialog } from "@/components/settings/team/delete-team-dialog";
import { InviteMemberDialog } from "@/components/settings/team/invite-member-dialog";
import { MembersTableServer } from "@/components/settings/team/members/table-server";
import { MembersTableSkeleton } from "@/components/settings/team/members/table-skeleton";
import { TeamDetailsForm } from "@/components/settings/team/team-details-form";
import { TeamLogoForm } from "@/components/settings/team/team-logo-form";
import type { TeamDetails } from "@/lib/schemas/teams";

interface TeamContentProps {
  allTeams: TeamDetails;
  activeTeam: TeamDetails[number];
}

export function TeamContent({ allTeams, activeTeam }: TeamContentProps) {
  return (
    <div className="flex flex-col gap-8 mt-10">
      {/* Team Information Section */}
      <div className="flex flex-col border-b pb-8 gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg md:text-xl font-semibold">Overview</h3>
        </div>
        <div className="flex flex-col gap-6 md:items-start">
          <TeamLogoForm
            teamId={activeTeam.id}
            initialLogoUrl={activeTeam.logo}
          />
          <TeamDetailsForm
            teamId={activeTeam.id}
            initialName={activeTeam.name}
          />
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
          <InviteMemberDialog allTeams={allTeams} />
        </div>
        <Suspense fallback={<MembersTableSkeleton />}>
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
        <DeleteTeamDialog teamName={activeTeam.name} />
      </div>
    </div>
  );
}
