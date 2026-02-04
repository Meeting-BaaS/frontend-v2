// /lib/apiClient.ts

import axios, { type AxiosError, type AxiosRequestConfig } from "axios"
import type { ZodType } from "zod"
import { env } from "@/env"
import { type ErrorResponse, errorResponseSchema } from "@/lib/schemas/common"

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_SERVER_BASEURL,
  timeout: 30000, // 30 seconds
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
})

/**
 * Extended Error type for API errors with code and original error
 */
export interface APIError extends Error {
  errorResponse: ErrorResponse
}

// Response interceptor to extract error messages from API responses
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Validate and extract error message from API response
    if (error.response?.data) {
      const parsed = errorResponseSchema.safeParse(error.response.data)
      if (parsed.success) {
        const apiError = new Error(parsed.data.message || parsed.data.error) as APIError
        // Attach error response and preserve original error for debugging
        apiError.errorResponse = parsed.data
        return Promise.reject(apiError)
      }
      console.error("Invalid API response:", parsed.error)
    }
    // Otherwise, return the original error
    return Promise.reject(error)
  }
)

export async function axiosGetInstance<T>(
  url: string,
  schema: ZodType<T>,
  options?: AxiosRequestConfig
): Promise<T> {
  const response = await api.get(url, options)

  const parsed = schema.safeParse(response.data)
  if (!parsed.success) {
    console.error("Invalid API response:", parsed.error)
    throw new Error("API response validation failed")
  }

  return parsed.data
}

export async function axiosPostInstance<TRequest, TResponse>(
  url: string,
  data: TRequest,
  schema?: ZodType<TResponse>,
  options?: AxiosRequestConfig
): Promise<TResponse | null> {
  const response = await api.post(url, data, options)

  // If no schema is provided (response is not expected), return null
  if (!schema) {
    return null
  }

  const parsed = schema.safeParse(response.data)
  if (!parsed.success) {
    console.error("Invalid API response:", parsed.error)
    throw new Error("API response validation failed")
  }

  return parsed.data
}

export async function axiosPutInstance<TRequest, TResponse>(
  url: string,
  data: TRequest,
  schema?: ZodType<TResponse>,
  options?: AxiosRequestConfig
): Promise<TResponse | null> {
  const response = await api.put(url, data, options)

  // If no schema is provided (response is not expected), return null
  if (!schema) {
    return null
  }

  const parsed = schema.safeParse(response.data)
  if (!parsed.success) {
    console.error("Invalid API response:", parsed.error)
    throw new Error("API response validation failed")
  }

  return parsed.data
}

export async function axiosPatchInstance<TRequest, TResponse>(
  url: string,
  data: TRequest,
  schema?: ZodType<TResponse>,
  options?: AxiosRequestConfig
): Promise<TResponse | null> {
  const response = await api.patch(url, data, options)

  // If no schema is provided (response is not expected), return null
  if (!schema) {
    return null
  }

  const parsed = schema.safeParse(response.data)
  if (!parsed.success) {
    console.error("Invalid API response:", parsed.error)
    throw new Error("API response validation failed")
  }

  return parsed.data
}

export async function axiosDeleteInstance(
  url: string,
  options?: AxiosRequestConfig
): Promise<null> {
  await api.delete(url, options)

  return null
}
