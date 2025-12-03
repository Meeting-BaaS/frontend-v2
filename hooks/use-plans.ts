import { useContext } from "react";
import { PlansContext } from "@/contexts/plans-context";

export function usePlans() {
  const context = useContext(PlansContext);
  if (context === undefined) {
    throw new Error("usePlans must be used within a PlansProvider");
  }
  return context;
}
