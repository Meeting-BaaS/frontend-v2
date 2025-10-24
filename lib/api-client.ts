// /lib/apiClient.ts

import axios, { type AxiosRequestConfig } from "axios";
import type { ZodType } from "zod";
import { env } from "@/env";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_SERVER_BASEURL,
  timeout: 30000, // 30 seconds
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export async function axiosGetInstance<T>(
  url: string,
  schema: ZodType<T>,
  options?: AxiosRequestConfig,
): Promise<T> {
  const response = await api.get(url, options);

  // To do: remove before production
  console.log(url, "Response:", JSON.stringify(response.data, null, 2));

  const parsed = schema.safeParse(response.data);
  if (!parsed.success) {
    console.error("Invalid API response:", parsed.error);
    throw new Error("API response validation failed");
  }

  return parsed.data;
}

export async function axiosPostInstance<TRequest, TResponse>(
  url: string,
  data: TRequest,
  schema: ZodType<TResponse>,
  options?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await api.post(url, data, options);

  // To do: remove before production
  console.log(url, "Response:", JSON.stringify(response.data, null, 2));

  const parsed = schema.safeParse(response.data);
  if (!parsed.success) {
    console.error("Invalid API response:", parsed.error);
    throw new Error("API response validation failed");
  }

  return parsed.data;
}

export async function axiosPutInstance<TRequest, TResponse>(
  url: string,
  data: TRequest,
  schema?: ZodType<TResponse>,
  options?: AxiosRequestConfig,
): Promise<TResponse | null> {
  const response = await api.put(url, data, options);

  // To do: remove before production
  console.log(url, "Response:", JSON.stringify(response.data, null, 2));

  // If no schema is provided (response is not expected), return null
  if (!schema) {
    return null;
  }

  const parsed = schema.safeParse(response.data);
  if (!parsed.success) {
    console.error("Invalid API response:", parsed.error);
    throw new Error("API response validation failed");
  }

  return parsed.data;
}
