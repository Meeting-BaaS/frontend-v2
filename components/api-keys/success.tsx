"use client";

import { CheckCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { CopyButton } from "../ui/copy-button";

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
  const [show, setShow] = useState(false);

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
            <InputGroup>
              <InputGroupInput
                name="api-key"
                placeholder="API Key"
                className="disabled:opacity-100"
                value={apiKey || ""}
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
                  <CopyButton text={apiKey || ""} />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
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
