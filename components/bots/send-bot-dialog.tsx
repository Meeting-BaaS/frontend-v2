"use client";

import { KeyRound, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";

export function SendBotDialog() {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");

  const keyReady = apiKey.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            Paste your API key and enter a meeting URL to send a bot.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <label
            htmlFor="api-key-input"
            className="text-sm font-medium leading-none"
          >
            API Key
          </label>
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              id="api-key-input"
              type="password"
              placeholder="mb_live_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Copy a key from{" "}
            <Link
              href="/api-keys"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              API Keys
            </Link>
            {" "}or create a new one there.
          </p>
        </div>
        {keyReady && (
          <SendBotForm
            apiKey={apiKey.trim()}
            onSuccess={() => setOpen(false)}
          />
        )}
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
