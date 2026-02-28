"use client";

import { CheckCircle } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
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
import { Field, FieldLabel } from "@/components/ui/field";
import { SecretField } from "@/components/ui/secret-field";

interface SuccessDialogProps {
  apiKey: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setApiKey: (apiKey: string | null) => void;
}

export function SuccessDialog({
  apiKey,
  open,
  onOpenChange,
  setApiKey,
}: SuccessDialogProps) {
  const onCancel = (updatedOpen: boolean) => {
    if (updatedOpen) {
      return;
    }
    onOpenChange(updatedOpen);
    setApiKey(null);
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>View API Key</DialogTitle>
          <DialogDescription className="sr-only">
            Your API key has been created successfully.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Alert className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 selection:!bg-blue-200 selection:!text-blue-900 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700 dark:selection:!bg-blue-700 dark:selection:!text-blue-100">
            <CheckCircle />
            <AlertTitle>
              You can only view this key once.{" "}
              <span className="font-bold">Store it safely.</span>
            </AlertTitle>
          </Alert>

          <Field>
            <FieldLabel htmlFor="api-key">API Key</FieldLabel>
            <SecretField
              value={apiKey || ""}
              name="api-key"
              placeholder="API Key"
            />
          </Field>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
