"use client";

import { createContext } from "react";
import type { Session, User } from "@/lib/schemas/session";
import type { TeamDetails } from "@/lib/schemas/teams";

interface UserContextType {
  user: User;
  session: Session;
  teamDetails: TeamDetails;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export function UserProvider({
  children,
  user,
  session,
  teamDetails,
}: Readonly<{
  children: React.ReactNode;
  user: User;
  session: Session;
  teamDetails: TeamDetails;
}>) {
  return (
    <UserContext.Provider value={{ user, session, teamDetails }}>
      {children}
    </UserContext.Provider>
  );
}
