"use client";

import { KeyRound, Loader2, Send } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { SendBotForm } from "@/components/bots/send-bot-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { axiosPostInstance } from "@/lib/api-client";
import { CREATE_API_KEY } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import {
  type CreateApiKeyResponse,
  createApiKeyResponseSchema,
} from "@/lib/schemas/api-keys";

function maskApiKey(key: string) {
  if (key.length <= 8) return `${key.slice(0, 2)}${"*".repeat(key.length - 2)}`;
  return `${key.slice(0, 4)}${"*".repeat(key.length - 8)}${key.slice(-4)}`;
}

export function SendBotDialog() {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const ensureApiKey = useCallback(async () => {
    if (apiKey) return;

    try {
      setLoading(true);
      const response = await axiosPostInstance<
        { name: string; permissions: "Sending access" | "Full access" },
        CreateApiKeyResponse
      >(
        CREATE_API_KEY,
        {
          name: "Dashboard",
          permissions: "Full access",
        },
        createApiKeyResponseSchema,
      );

      if (!response?.success || !response.data.key) {
        throw new Error("Failed to create API key");
      }

      setApiKey(response.data.key);
    } catch (error) {
      console.error("Error creating API key", error);
      toast.error(error instanceof Error ? error.message : genericError);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      ensureApiKey();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Send className="mr-2 h-4 w-4" />
          Manual
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send a Bot</DialogTitle>
          <DialogDescription>
            Enter a meeting URL to send a bot that will join and record the
            meeting.
          </DialogDescription>
          {apiKey && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
              <KeyRound className="h-3 w-3" />
              <span className="font-mono">{maskApiKey(apiKey)}</span>
            </div>
          )}
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : apiKey ? (
          <SendBotForm apiKey={apiKey} onSuccess={() => setOpen(false)} />
        ) : null}
        <p className="text-center text-xs text-muted-foreground">
          Entirely built with the{" "}
          <a
            href="https://docs.meetingbaas.com/typescript-sdk"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Meeting BaaS TypeScript SDK
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
}
