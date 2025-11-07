"use client";

import { createContext, useCallback, useMemo, useState } from "react";
import type { Session, User } from "@/lib/schemas/session";
import type { TeamDetails } from "@/lib/schemas/teams";

interface UserContextType {
  user: User;
  session: Session;
  teamDetails: TeamDetails;
  updateTeam: (teamId: number, updates: Partial<TeamDetails[number]>) => void;
  updateUser: (updates: Partial<User>) => void;
  activeTeam: TeamDetails[number] | null;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export function UserProvider({
  children,
  user: initialUser,
  session,
  teamDetails: initialTeamDetails,
}: Readonly<{
  children: React.ReactNode;
  user: User;
  session: Session;
  teamDetails: TeamDetails;
}>) {
  const [user, setUser] = useState<User>(initialUser);
  const [teamDetails, setTeamDetails] =
    useState<TeamDetails>(initialTeamDetails);

  const updateTeam = useCallback(
    (teamId: number, updates: Partial<TeamDetails[number]>) => {
      console.log("Updating team", teamId, updates);
      setTeamDetails((prev) =>
        prev.map((team) =>
          team.id === teamId ? { ...team, ...updates } : team,
        ),
      );
    },
    [],
  );

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  const activeTeam = useMemo(
    () => teamDetails.find((team) => team.isActive),
    [teamDetails],
  );

  return (
    <UserContext.Provider
      value={{
        user,
        session,
        teamDetails,
        updateTeam,
        updateUser,
        activeTeam: activeTeam ?? null,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
