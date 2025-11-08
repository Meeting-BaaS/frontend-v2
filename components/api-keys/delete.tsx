"use client";

import { SendHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { genericError } from "@/lib/errors";
import type { ApiKey } from "@/lib/schemas/api-keys";
import { CopyButton } from "../ui/copy-button";

interface DeleteAPIKeyDialogProps {
  open: boolean;
  apiKey: Omit<ApiKey, "key" | "metadata">;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAPIKeyDialog({
  open,
  onOpenChange,
  apiKey,
}: DeleteAPIKeyDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [typedText, setTypedText] = useState("");

  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading || typedText !== "delete") return;

    try {
      setLoading(true);

      const { data, error } = await authClient.apiKey.delete({
        keyId: apiKey.id,
      });

      if (error || !data.success) {
        throw new Error(error?.message || "Failed to delete API key");
      }

      if (pathname.endsWith("/api-keys")) {
        router.refresh();
      } else {
        // If the path name does not end with /api-keys, i.e., /api-keys/123, redirect to the api-keys page
        router.push("/api-keys");
      }
      onCancel(false);

      toast.success("API key deleted successfully");
    } catch (error) {
      console.error("Error deleting API key", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = (updatedOpen: boolean) => {
    if (updatedOpen || loading) {
      return;
    }
    setTypedText("");
    onOpenChange(updatedOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Delete API Key</DialogTitle>
          <DialogDescription className="sr-only">
            Click the button to delete the API key.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} noValidate>
          <div className="space-y-6 pb-8">
            <div className="flex flex-col gap-1">
              <p>Are you sure you want to delete this API key?</p>
              <p className="text-sm text-destructive">
                <span className="font-bold">Warning:</span> This action cannot
                be undone.
              </p>
            </div>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="delete-confirmation">
                  Type{" "}
                  <Badge
                    variant="warning"
                    className="flex items-center gap-2 py-1 text-sm"
                  >
                    delete
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-3 [&_svg]:size-3 [&_svg]:text-foreground"
                      asChild
                    >
                      <CopyButton text="delete" />
                    </Button>
                  </Badge>{" "}
                  to confirm
                </FieldLabel>
                <FieldContent>
                  <Input
                    value={typedText}
                    id="delete-confirmation"
                    onChange={(e) => setTypedText(e.target.value)}
                    disabled={loading}
                    aria-label="Type 'delete' to confirm"
                    aria-required="true"
                  />
                </FieldContent>
              </Field>
            </FieldGroup>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="destructive"
              disabled={loading || typedText !== "delete"}
              aria-busy={loading}
              aria-disabled={loading}
              aria-label={loading ? "Deleting" : "Delete"}
            >
              {loading ? (
                <>
                  <Spinner /> Deleting
                </>
              ) : (
                <>
                  <SendHorizontal />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
