"use client";

import { CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { axiosPostInstance } from "@/lib/api-client";
import { CREATE_API_KEY } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import {
  type CreateApiKeyResponse,
  createApiKeyResponseSchema,
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
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  const handleCreateApiKey = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const response = await axiosPostInstance<
        { name: string; permissions: "Sending access" | "Full access" },
        CreateApiKeyResponse
      >(
        CREATE_API_KEY,
        {
          name: "Onboarding",
          permissions: "Full access",
        },
        createApiKeyResponseSchema,
      );

      if (!response || !response.success || !response.data.key) {
        throw new Error("Failed to create API key");
      }

      // Store the API key to display it
      setApiKey(response.data.key);
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
              isActive
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground",
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
            We'll create an API key named "Onboarding" for you. This key will be
            used to authenticate your bot requests.
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
        {isCompleted && apiKey && (
          <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
            <Field>
              <FieldLabel htmlFor="api-key">
                API key created successfully!
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  name="api-key"
                  placeholder="API Key"
                  className="disabled:opacity-100"
                  value={apiKey}
                  readOnly
                  type={show ? "text" : "password"}
                  disabled
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    size="icon-xs"
                    aria-label="Show/Hide API Key"
                    onClick={() => setShow(!show)}
                  >
                    {show ? <Eye /> : <EyeOff />}
                  </InputGroupButton>
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <InputGroupButton size="icon-xs" asChild>
                    <CopyButton text={apiKey} />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}
