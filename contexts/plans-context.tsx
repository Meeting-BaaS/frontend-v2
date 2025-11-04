"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { axiosGetInstance } from "@/lib/api-client";
import { GET_PLANS } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import type { PlanInfo, PlansResponse } from "@/lib/schemas/settings";
import { plansResponseSchema } from "@/lib/schemas/settings";

interface PlansContextType {
  plans: PlanInfo[];
  currentPlan: string;
  currentSubscriptionId: string | null;
  loading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const PlansContext = createContext<PlansContextType | undefined>(
  undefined,
);

interface PlansProviderProps {
  children: React.ReactNode;
}

export function PlansProvider({ children }: PlansProviderProps) {
  const [plans, setPlans] = useState<PlanInfo[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>("payg");
  const [currentSubscriptionId, setCurrentSubscriptionId] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchPlans = useCallback(async () => {
    // Skip if already fetched and we have data
    if (hasFetched && plans.length > 0) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axiosGetInstance<PlansResponse>(
        GET_PLANS,
        plansResponseSchema,
      );

      if (!response || !response.success) {
        throw new Error("Failed to fetch plans");
      }

      setPlans(response.data.plans);
      setCurrentPlan(response.data.currentPlan);
      setCurrentSubscriptionId(response.data.currentSubscriptionId ?? null);
      setHasFetched(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : genericError;
      setError(errorMessage);
      console.error("Error fetching plans", err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [hasFetched, plans.length]);

  // Force refetch (ignores cache)
  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosGetInstance<PlansResponse>(
        GET_PLANS,
        plansResponseSchema,
      );

      if (!response || !response.success) {
        throw new Error("Failed to fetch plans");
      }

      setPlans(response.data.plans);
      setCurrentPlan(response.data.currentPlan);
      setCurrentSubscriptionId(response.data.currentSubscriptionId ?? null);
      setHasFetched(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : genericError;
      setError(errorMessage);
      console.error("Error fetching plans", err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch plans on mount
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return (
    <PlansContext.Provider
      value={{
        plans,
        currentPlan,
        currentSubscriptionId,
        loading,
        error,
        fetchPlans,
        refetch,
      }}
    >
      {children}
    </PlansContext.Provider>
  );
}
