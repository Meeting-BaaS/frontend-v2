"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormFields } from "@/components/api-keys/form-fields";
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
import { axiosPutInstance } from "@/lib/api-client";
import { UPDATE_API_KEY } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import type { ApiKey } from "@/lib/schemas/api-keys";
import {
  type CreateAPIKeyFormData,
  createAPIKeyFormSchema,
  permissionMap,
} from "@/lib/schemas/api-keys";

interface EditAPIKeyDialogProps {
  open: boolean;
  apiKey: Omit<ApiKey, "key" | "metadata">;
  onOpenChange: (open: boolean) => void;
}

export function EditAPIKeyDialog({
  open,
  onOpenChange,
  apiKey,
}: EditAPIKeyDialogProps) {
  const router = useRouter();

  // Map server permissions to frontend permissions
  const mappedPermissions = permissionMap[apiKey.permissions.access.join("_")];

  const form = useForm<CreateAPIKeyFormData>({
    resolver: zodResolver(createAPIKeyFormSchema),
    defaultValues: {
      name: apiKey.name || "",
      permissions: mappedPermissions,
    },
  });
  const [loading, setLoading] = useState(false);

  const isDirty = form.formState.isDirty;

  const onSubmit = async (data: CreateAPIKeyFormData) => {
    if (loading) return;

    const body = {
      ...data,
      apiKeyId: apiKey.id,
    };

    try {
      setLoading(true);

      await axiosPutInstance<CreateAPIKeyFormData, null>(UPDATE_API_KEY, body);

      router.refresh();
      onOpenChange(false);

      form.reset(data);
      toast.success("API key updated successfully");
    } catch (error) {
      console.error("Error updating API key", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = (updatedOpen: boolean) => {
    if (updatedOpen || loading) {
      return;
    }
    form.reset();
    onOpenChange(updatedOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Update API Key</DialogTitle>
          <DialogDescription>
            Update the name or permission of the API key.
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
                disabled={loading || !isDirty}
                aria-busy={loading}
                aria-disabled={loading}
                aria-label={loading ? "Updating" : "Update"}
              >
                {loading ? (
                  <>
                    <Spinner /> Updating
                  </>
                ) : (
                  <>
                    <SendHorizontal />
                    Update
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
