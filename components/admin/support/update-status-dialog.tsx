"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form, FormControl, FormField } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { axiosPostInstance } from "@/lib/api-client";
import { ADMIN_UPDATE_TICKET_STATUS } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import {
  type UpdateTicketStatusRequest,
  updateTicketStatusRequestSchema,
} from "@/lib/schemas/admin";

const statusOptions: UpdateTicketStatusRequest["status"][] = [
  "open",
  "awaiting_client",
  "awaiting_agent",
  "resolved",
  "in_progress",
  "closed",
];

interface UpdateTicketStatusDialogProps {
  ticketId: string;
  currentStatus: UpdateTicketStatusRequest["status"];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateTicketStatusDialog({
  ticketId,
  currentStatus,
  open,
  onOpenChange,
}: UpdateTicketStatusDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateTicketStatusRequest>({
    resolver: zodResolver(updateTicketStatusRequestSchema),
    defaultValues: {
      status: currentStatus,
    },
  });

  const onSubmit = async (data: UpdateTicketStatusRequest) => {
    if (loading) return;

    try {
      setLoading(true);
      await axiosPostInstance(
        ADMIN_UPDATE_TICKET_STATUS(ticketId),
        data,
        undefined,
      );
      toast.success("Ticket status updated successfully");
      router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating ticket status", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Update Ticket Status</DialogTitle>
          <DialogDescription>
            Change the status of this support ticket.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <FormField
                control={form.control}
                name="status"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Status</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={loading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status
                                  .split("_")
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1),
                                  )
                                  .join(" ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FieldError
                        errors={
                          fieldState.error ? [fieldState.error] : undefined
                        }
                      />
                    </FieldContent>
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading} aria-busy={loading}>
                {loading ? <Spinner /> : "Update Status"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
