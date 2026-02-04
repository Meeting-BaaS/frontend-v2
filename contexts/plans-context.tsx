"use client"

import { createContext, useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { useConfiguration } from "@/hooks/use-configuration"
import { axiosGetInstance } from "@/lib/api-client"
import { GET_PLANS, GET_TOKEN_PACKS } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import type { PlanInfo, PlansResponse, TokenPack, TokenPacksResponse } from "@/lib/schemas/settings"
import { plansResponseSchema, tokenPacksResponseSchema } from "@/lib/schemas/settings"

interface PlansContextType {
  plans: PlanInfo[]
  tokenPacks: TokenPack[]
  currentPlan: string
  currentSubscriptionId: string | null
  cancelAtPeriodEnd: boolean
  loading: boolean
  tokenPacksLoading: boolean
  error: string | null
  fetchPlans: () => Promise<void>
  fetchTokenPacks: () => Promise<void>
  refetch: () => Promise<void>
  refetchTokenPacks: () => Promise<void>
}

export const PlansContext = createContext<PlansContextType | undefined>(undefined)

interface PlansProviderProps {
  children: React.ReactNode
}

export function PlansProvider({ children }: PlansProviderProps) {
  const { configuration } = useConfiguration()
  const stripeEnabled = configuration?.features?.stripe ?? false

  const [plans, setPlans] = useState<PlanInfo[]>([])
  const [tokenPacks, setTokenPacks] = useState<TokenPack[]>([])
  const [currentPlan, setCurrentPlan] = useState<string>("payg")
  const [currentSubscriptionId, setCurrentSubscriptionId] = useState<string | null>(null)
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [tokenPacksLoading, setTokenPacksLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasFetched, setHasFetched] = useState(false)
  const [hasFetchedTokenPacks, setHasFetchedTokenPacks] = useState(false)

  const fetchPlans = useCallback(async () => {
    if (!stripeEnabled) return
    // Skip if already fetched and we have data
    if (hasFetched && plans.length > 0) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await axiosGetInstance<PlansResponse>(GET_PLANS, plansResponseSchema)

      if (!response || !response.success) {
        throw new Error("Failed to fetch plans")
      }

      setPlans(response.data.plans)
      setCurrentPlan(response.data.currentPlan)
      setCurrentSubscriptionId(response.data.currentSubscriptionId ?? null)
      setCancelAtPeriodEnd(response.data.cancelAtPeriodEnd ?? false)
      setHasFetched(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : genericError
      setError(errorMessage)
      console.error("Error fetching plans", err)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [stripeEnabled, hasFetched, plans.length])

  // Force refetch (ignores cache)
  const refetch = useCallback(async () => {
    if (!stripeEnabled) return
    try {
      setLoading(true)
      setError(null)
      const response = await axiosGetInstance<PlansResponse>(GET_PLANS, plansResponseSchema)

      if (!response || !response.success) {
        throw new Error("Failed to fetch plans")
      }

      setPlans(response.data.plans)
      setCurrentPlan(response.data.currentPlan)
      setCurrentSubscriptionId(response.data.currentSubscriptionId ?? null)
      setCancelAtPeriodEnd(response.data.cancelAtPeriodEnd ?? false)
      setHasFetched(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : genericError
      setError(errorMessage)
      console.error("Error fetching plans", err)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [stripeEnabled])

  const fetchTokenPacks = useCallback(async () => {
    if (!stripeEnabled) return
    // Skip if already fetched and we have data
    if (hasFetchedTokenPacks && tokenPacks.length > 0) {
      return
    }

    try {
      setTokenPacksLoading(true)
      setError(null)
      const response = await axiosGetInstance<TokenPacksResponse>(
        GET_TOKEN_PACKS,
        tokenPacksResponseSchema
      )

      if (!response || !response.success) {
        throw new Error("Failed to fetch token packs")
      }

      setTokenPacks(response.data)
      setHasFetchedTokenPacks(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : genericError
      setError(errorMessage)
      console.error("Error fetching token packs", err)
      toast.error(errorMessage)
    } finally {
      setTokenPacksLoading(false)
    }
  }, [stripeEnabled, hasFetchedTokenPacks, tokenPacks.length])

  // Force refetch token packs (ignores cache)
  const refetchTokenPacks = useCallback(async () => {
    if (!stripeEnabled) return
    try {
      setTokenPacksLoading(true)
      setError(null)
      const response = await axiosGetInstance<TokenPacksResponse>(
        GET_TOKEN_PACKS,
        tokenPacksResponseSchema
      )

      if (!response || !response.success) {
        throw new Error("Failed to fetch token packs")
      }

      setTokenPacks(response.data)
      setHasFetchedTokenPacks(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : genericError
      setError(errorMessage)
      console.error("Error fetching token packs", err)
      toast.error(errorMessage)
    } finally {
      setTokenPacksLoading(false)
    }
  }, [stripeEnabled])

  // Fetch plans on mount only when Stripe is enabled
  useEffect(() => {
    if (stripeEnabled) fetchPlans()
  }, [stripeEnabled, fetchPlans])

  // Fetch token packs on mount only when Stripe is enabled
  useEffect(() => {
    if (stripeEnabled) fetchTokenPacks()
  }, [stripeEnabled, fetchTokenPacks])

  return (
    <PlansContext.Provider
      value={{
        plans,
        tokenPacks,
        currentPlan,
        currentSubscriptionId,
        cancelAtPeriodEnd,
        loading,
        tokenPacksLoading,
        error,
        fetchPlans,
        fetchTokenPacks,
        refetch,
        refetchTokenPacks
      }}
    >
      {children}
    </PlansContext.Provider>
  )
}
