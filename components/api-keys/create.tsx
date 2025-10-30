"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormFields } from "@/components/api-keys/form-fields";
import { SuccessDialog } from "@/components/api-keys/success";
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
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { axiosPostInstance } from "@/lib/api-client";
import { CREATE_API_KEY } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import {
  type CreateAPIKeyFormData,
  type CreateApiKeyResponse,
  createAPIKeyFormSchema,
  createApiKeyResponseSchema,
  permissionsEnum,
} from "@/lib/schemas/api-keys";

interface CreateAPIKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAPIKeyDialog({
  open,
  onOpenChange,
}: CreateAPIKeyDialogProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm<CreateAPIKeyFormData>({
    resolver: zodResolver(createAPIKeyFormSchema),
    defaultValues: {
      name: "",
      permissions: permissionsEnum[0],
    },
  });
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  const onSubmit = async (data: CreateAPIKeyFormData) => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await axiosPostInstance<
        CreateAPIKeyFormData,
        CreateApiKeyResponse
      >(CREATE_API_KEY, data, createApiKeyResponseSchema);

      if (!response || !response.success) {
        console.error("Failed to create API key", response);
        throw new Error("Failed to create API key");
      }
      // Set API key to the state, open success dialog and close the create dialog
      setApiKey(response.data.key);
      setSuccessOpen(true);
      onCancel(false, true);
    } catch (error) {
      console.error("Error creating API key", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = (updatedOpen: boolean, nextJsReload?: boolean) => {
    if (updatedOpen || loading) {
      return;
    }
    form.reset();
    onOpenChange(updatedOpen);

    // Remove new=true from searchParams when dialog closes
    if (searchParams.get("new") === "true") {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("new");
      const newUrl = newSearchParams.toString()
        ? `${pathname}?${newSearchParams.toString()}`
        : pathname;

      // If nextJsReload is true, we will reload the page using the next/navigation router
      // Otherwise, we will push the new URL to the history stack
      // This is useful to refetch the data from server when needed
      if (!nextJsReload) {
        window.history.pushState(null, "", newUrl);
      } else {
        router.replace(newUrl, { scroll: false });
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onCancel}>
        <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
          <DialogHeader>
            <DialogTitle>Add API Key</DialogTitle>
            <DialogDescription>
              Create a new API key to access Meeting BaaS APIs.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormFields loading={loading} />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  aria-disabled={loading}
                  aria-label={loading ? "Saving" : "Save"}
                >
                  {loading ? (
                    <>
                      <Spinner /> Saving
                    </>
                  ) : (
                    <>
                      <SendHorizontal />
                      Save
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <SuccessDialog
        apiKey={apiKey}
        open={successOpen}
        onOpenChange={setSuccessOpen}
        setApiKey={setApiKey}
      />
    </>
  );
}
