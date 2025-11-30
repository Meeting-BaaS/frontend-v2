"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError } from "@/components/ui/field";
import { Form, FormControl, FormField } from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { axiosPostInstance } from "@/lib/api-client";
import {
  ADMIN_REPLY_TICKET,
  UPDATE_TICKET,
  UPDATE_TICKET_STATUS,
} from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import {
  type AdminReplyTicketRequest,
  type AdminReplyTicketResponse,
  adminReplyTicketResponseSchema,
} from "@/lib/schemas/admin";
import {
  type TicketDetails,
  type UpdateTicketFormData,
  type UpdateTicketStatusRequest,
  updateTicketFormSchema,
} from "@/lib/schemas/support";

interface TicketAddMessageProps {
  ticketId: string;
  status: TicketDetails["status"];
  isAdmin?: boolean;
}

export function TicketAddMessage({
  ticketId,
  status,
  isAdmin = false,
}: TicketAddMessageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateTicketFormData>({
    resolver: zodResolver(updateTicketFormSchema),
    defaultValues: {
      content: "",
    },
  });

  const contentValue = form.watch("content");

  const handleReopenTicket = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const requestData: UpdateTicketStatusRequest = {
        ticketId,
        status: "open",
      };

      await axiosPostInstance<UpdateTicketStatusRequest, void>(
        UPDATE_TICKET_STATUS,
        requestData,
        undefined, // No response schema expected for 204 No Content
      );

      toast.success("Ticket reopened");
      router.refresh();
    } catch (error) {
      console.error("Error updating ticket status", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: UpdateTicketFormData) => {
    if (loading) return;

    if (status === "resolved" || status === "closed") {
      toast.error(
        "You can't add a new message to a resolved or closed ticket",
        {
          action: (
            <Button size="sm" variant="outline" onClick={handleReopenTicket}>
              Reopen ticket
            </Button>
          ),
        },
      );
      return;
    }

    try {
      setLoading(true);

      if (isAdmin) {
        // Admin reply endpoint
        await axiosPostInstance<
          AdminReplyTicketRequest,
          AdminReplyTicketResponse
        >(
          ADMIN_REPLY_TICKET(ticketId),
          {
            content: data.content,
          },
          adminReplyTicketResponseSchema,
        );
      } else {
        // Regular user update endpoint
        await axiosPostInstance<{ ticketId: string; content: string }, void>(
          UPDATE_TICKET,
          {
            ticketId,
            content: data.content,
          },
          undefined,
        );
      }

      toast.success("Message added successfully");
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Error updating ticket", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldContent>
                <FormControl>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="content"
                      maxLength={2000}
                      disabled={loading}
                      placeholder="Add more details..."
                      rows={4}
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums text-xs">
                        {contentValue.length}/2000 characters
                      </InputGroupText>
                      <InputGroupButton
                        type="submit"
                        variant="default"
                        className="rounded-full ml-auto"
                        size="icon-xs"
                        disabled={loading || !contentValue.trim()}
                      >
                        {loading ? (
                          <Spinner className="size-3.5" />
                        ) : (
                          <ArrowUp className="size-3.5" />
                        )}
                        <span className="sr-only">Send</span>
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                {fieldState.invalid && (
                  <FieldError
                    errors={fieldState.error ? [fieldState.error] : undefined}
                  />
                )}
              </FieldContent>
            </Field>
          )}
        />
      </form>
    </Form>
  );
}
