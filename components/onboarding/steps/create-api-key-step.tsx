"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { axiosPostInstance } from "@/lib/api-client";
import { CREATE_API_KEY } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import {
  type CreateApiKeyResponse,
  createApiKeyResponseSchema,
  permissionsEnum,
} from "@/lib/schemas/api-keys";
import { cn } from "@/lib/utils";

interface CreateApiKeyStepProps {
  step: number;
  isActive: boolean;
  isCompleted: boolean;
  onComplete: (apiKey: string) => void;
}

export function CreateApiKeyStep({
  step,
  isActive,
  isCompleted,
  onComplete,
}: CreateApiKeyStepProps) {
  const [loading, setLoading] = useState(false);

  const handleCreateApiKey = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const response = await axiosPostInstance<
        { name: string; permissions: string },
        CreateApiKeyResponse
      >(
        CREATE_API_KEY,
        {
          name: "Onboarding",
          permissions: "Full access", // Full access maps to read_write_delete
        },
        createApiKeyResponseSchema,
      );

      if (!response || !response.success || !response.data.key) {
        throw new Error("Failed to create API key");
      }

      // Store the API key but don't show it to the user
      onComplete(response.data.key);
      toast.success("API key created successfully!");
    } catch (error) {
      console.error("Error creating API key", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-6 border-l-2 pb-8 pl-6 transition-colors",
        isActive ? "border-primary" : "border-border",
        isCompleted && "border-green-500/50",
      )}
    >
      <div className="flex-shrink-0">
        {isCompleted ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
        ) : (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
            )}
          >
            <span className="text-sm font-semibold">{step}</span>
          </div>
        )}
      </div>
      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Create an API Key</h3>
          <p className="text-sm text-muted-foreground">
            We'll create an API key named "Onboarding" for you. This key will
            be used to authenticate your bot requests.
          </p>
        </div>
        {!isCompleted && (
          <Button
            onClick={handleCreateApiKey}
            disabled={loading || !isActive}
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create API Key"
            )}
          </Button>
        )}
        {isCompleted && (
          <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
            API key created successfully!
          </div>
        )}
      </div>
    </div>
  );
}

