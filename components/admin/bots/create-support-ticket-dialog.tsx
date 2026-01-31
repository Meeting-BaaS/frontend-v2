"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { axiosGetInstance, axiosPostInstance } from "@/lib/api-client";
import {
  ADMIN_CREATE_SUPPORT_TICKET,
  ADMIN_GET_TEAM_DETAILS,
} from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import {
  type GetAdminTeamDetailsResponse,
  getAdminTeamDetailsResponseSchema,
} from "@/lib/schemas/admin";
import {
  type CreateAdminSupportTicketFormData,
  type CreateAdminSupportTicketResponse,
  createAdminSupportTicketFormSchema,
  createAdminSupportTicketResponseSchema,
} from "@/lib/schemas/admin-support-tickets";
import {
  type Module,
  moduleEnum,
  moduleLabels,
  type Type,
  typeEnum,
  typeLabels,
} from "@/lib/schemas/support";

interface CreateAdminSupportTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: number;
  initialBotUuid?: string | null;
  initialModule?: Module | null;
  initialType?: Type | null;
}

const moduleOptions = moduleEnum.options.map((value) => ({
  value,
  label: moduleLabels[value],
}));

const typeOptions = typeEnum.options.map((value) => ({
  value,
  label: typeLabels[value],
}));

export function CreateAdminSupportTicketDialog({
  open,
  onOpenChange,
  teamId,
  initialBotUuid,
  initialModule,
  initialType,
}: CreateAdminSupportTicketDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Fetch team members
  const { data: teamDetails, isLoading: isLoadingTeamMembers } = useQuery({
    queryKey: ["admin-team-details", teamId],
    queryFn: async () => {
      const response = await axiosGetInstance<GetAdminTeamDetailsResponse>(
        ADMIN_GET_TEAM_DETAILS(teamId),
        getAdminTeamDetailsResponseSchema,
      );
      return response.data;
    },
    enabled: open && !!teamId,
  });

  const form = useForm<CreateAdminSupportTicketFormData>({
    resolver: zodResolver(createAdminSupportTicketFormSchema),
    defaultValues: {
      createdOnBehalfOfUserId: 0,
      module: initialModule ?? "bots",
      type: initialType ?? "bug",
      subject: "",
      details: "",
      botUuid: undefined,
    },
  });

  const { reset } = form;

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset({
        createdOnBehalfOfUserId: 0,
        module: initialModule ?? "bots",
        type: initialType ?? "bug",
        subject: "",
        details: "",
        botUuid: initialBotUuid ?? undefined,
      });
    }
  }, [open, reset, initialBotUuid, initialModule, initialType]);

  const detailsValue = form.watch("details");

  const onSubmit = async (data: CreateAdminSupportTicketFormData) => {
    if (loading) return;

    try {
      setLoading(true);

      const response = await axiosPostInstance<
        typeof data,
        CreateAdminSupportTicketResponse
      >(
        ADMIN_CREATE_SUPPORT_TICKET(teamId),
        data,
        createAdminSupportTicketResponseSchema,
      );

      if (!response || !response.success) {
        console.error("Failed to create support ticket", response);
        throw new Error("Failed to create support ticket");
      }

      toast.success("Support ticket created successfully", {
        action: (
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              router.push(`/admin/support?ticketId=${response.data.ticketId}`)
            }
          >
            View Ticket
          </Button>
        ),
      });
      form.reset();
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error creating support ticket", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = (updatedOpen: boolean) => {
    if (updatedOpen && loading) {
      return;
    }
    form.reset();
    onOpenChange(updatedOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        showCloseButton={!loading}
      >
        <DialogHeader>
          <DialogTitle>Create Support Ticket (Admin)</DialogTitle>
          <DialogDescription>
            Create a support ticket on behalf of a team member. Can be used to
            track external support requests (Discord, email, etc.)
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-2 space-y-4">
              <FormField
                control={form.control}
                name="createdOnBehalfOfUserId"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-1 md:col-span-2"
                  >
                    <FieldLabel htmlFor={field.name}>
                      Team Member (Created on behalf of)
                    </FieldLabel>
                    <FieldContent>
                      <FormControl>
                        {isLoadingTeamMembers ? (
                          <div className="flex items-center gap-2 p-2">
                            <Spinner className="h-4 w-4" />
                            <span className="text-sm text-muted-foreground">
                              Loading team members...
                            </span>
                          </div>
                        ) : (
                          <Select
                            name={field.name}
                            value={field.value ? String(field.value) : ""}
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            disabled={loading || isLoadingTeamMembers}
                          >
                            <SelectTrigger className="w-full" id={field.name}>
                              <SelectValue placeholder="Select team member" />
                            </SelectTrigger>
                            <SelectContent>
                              {teamDetails?.members.map((member) => (
                                <SelectItem
                                  key={member.userId}
                                  value={String(member.userId)}
                                >
                                  {member.userName} ({member.userEmail})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </FormControl>
                      <FieldError />
                    </FieldContent>
                  </Field>
                )}
              />
              <FormField
                control={form.control}
                name="module"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-1"
                  >
                    <FieldLabel htmlFor={field.name}>Module</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={loading}
                        >
                          <SelectTrigger className="w-full" id={field.name}>
                            <SelectValue placeholder="Select module" />
                          </SelectTrigger>
                          <SelectContent>
                            {moduleOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FieldError />
                    </FieldContent>
                  </Field>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-1"
                  >
                    <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={loading}
                        >
                          <SelectTrigger className="w-full" id={field.name}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {typeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FieldError />
                    </FieldContent>
                  </Field>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-1 md:col-span-2"
                  >
                    <FieldLabel htmlFor={field.name}>Subject</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <InputGroup>
                          <Input
                            id={field.name}
                            placeholder="Brief description of the issue"
                            disabled={loading}
                            {...field}
                          />
                        </InputGroup>
                      </FormControl>
                      <FieldDescription>
                        The subject entered here is appended to the email sent
                        to the user.
                      </FieldDescription>
                      <FieldError />
                    </FieldContent>
                  </Field>
                )}
              />
              <FormField
                control={form.control}
                name="details"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-1 md:col-span-2"
                  >
                    <FieldLabel htmlFor={field.name}>Details</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <InputGroup>
                          <InputGroupTextarea
                            id={field.name}
                            placeholder="Provide detailed information about the issue..."
                            rows={6}
                            disabled={loading}
                            {...field}
                          />
                          <InputGroupAddon align="block-end">
                            <span className="tabular-nums text-xs text-muted-foreground">
                              {detailsValue.length} / 2000
                            </span>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormControl>
                      <FieldError />
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
              <Button type="submit" disabled={loading}>
                {loading && <Spinner className="h-4 w-4 mr-2" />}
                Create Ticket
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
