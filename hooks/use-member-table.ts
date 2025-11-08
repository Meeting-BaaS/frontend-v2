import { useContext } from "react";
import { MemberTableContext } from "@/contexts/member-table-context";

export function useMemberTable() {
  const context = useContext(MemberTableContext);
  if (context === undefined) {
    throw new Error("useMemberTable must be used within a MemberTableProvider");
  }
  return context;
}
