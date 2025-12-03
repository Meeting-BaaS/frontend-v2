"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Image, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  InputGroupText,
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
import { axiosPostInstance } from "@/lib/api-client";
import { CREATE_SUPPORT_TICKET } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import {
  ALLOWED_SUPPORT_FILE_TYPES,
  type CreateSupportTicketFormData,
  type CreateSupportTicketResponse,
  createSupportTicketFormSchema,
  createSupportTicketResponseSchema,
  MAX_SUPPORT_FILES,
  type Module,
  moduleEnum,
  moduleLabels,
  typeEnum,
  typeLabels,
} from "@/lib/schemas/support";

interface CreateSupportTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialBotUuid?: string | null;
  initialModule?: Module | null;
}

const moduleOptions = moduleEnum.options.map((value) => ({
  value,
  label: moduleLabels[value],
}));

const typeOptions = typeEnum.options.map((value) => ({
  value,
  label: typeLabels[value],
}));

export function CreateSupportTicketDialog({
  open,
  onOpenChange,
  initialBotUuid,
  initialModule,
}: CreateSupportTicketDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreateSupportTicketFormData>({
    resolver: zodResolver(createSupportTicketFormSchema),
    defaultValues: {
      module: initialModule ?? "bots",
      type: "bug",
      subject: "",
      details: "",
      botUuid: initialBotUuid ?? undefined,
      files: [],
    },
  });

  const { reset } = form;

  // Reset form when dialog opens with new initial values
  useEffect(() => {
    if (open) {
      reset({
        module: initialModule ?? "bots",
        type: "bug",
        subject: "",
        details: "",
        botUuid: initialBotUuid ?? undefined,
        files: [],
      });
      setSelectedFiles([]);
    }
  }, [open, initialModule, initialBotUuid, reset]);

  const detailsValue = form.watch("details");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...selectedFiles, ...files];

    setSelectedFiles(newFiles);
    form.setValue("files", newFiles, { shouldValidate: true });

    // Clear the input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    form.setValue("files", newFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const onSubmit = async (data: CreateSupportTicketFormData) => {
    if (loading) return;

    try {
      setLoading(true);

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append("module", data.module);
      formData.append("type", data.type);
      formData.append("subject", data.subject);
      formData.append("details", data.details);
      if (data.botUuid) {
        formData.append("botUuid", data.botUuid);
      }

      // Append files
      data.files?.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axiosPostInstance<
        FormData,
        CreateSupportTicketResponse
      >(CREATE_SUPPORT_TICKET, formData, createSupportTicketResponseSchema, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
              router.push(`/support-center/${response.data.ticketId}`)
            }
          >
            View Ticket
          </Button>
        ),
      });
      form.reset();
      setSelectedFiles([]);
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
    setSelectedFiles([]);
    onOpenChange(updatedOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        showCloseButton={!loading}
      >
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <DialogDescription>
            Report bugs, request features, or get help from our support team.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-2 space-y-4">
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
                      <FieldError
                        errors={
                          fieldState.error ? [fieldState.error] : undefined
                        }
                      />
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
                      <FieldError
                        errors={
                          fieldState.error ? [fieldState.error] : undefined
                        }
                      />
                    </FieldContent>
                  </Field>
                )}
              />

              <FormField
                control={form.control}
                name="botUuid"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-1 md:col-span-2"
                  >
                    <FieldLabel htmlFor={field.name}>
                      Bot ID (Optional)
                    </FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input
                          {...field}
                          id={field.name}
                          disabled={loading}
                          placeholder="Enter bot UUID if applicable"
                          aria-invalid={fieldState.invalid}
                        />
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
                        <Input
                          {...field}
                          id={field.name}
                          maxLength={200}
                          disabled={loading}
                          placeholder="Brief description of your issue"
                          aria-invalid={fieldState.invalid}
                        />
                      </FormControl>
                      <div className="flex justify-between items-center">
                        <FieldError
                          errors={
                            fieldState.error ? [fieldState.error] : undefined
                          }
                        />
                      </div>
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
                    <FieldLabel htmlFor={field.name}>Message</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <InputGroup>
                          <InputGroupTextarea
                            {...field}
                            id={field.name}
                            maxLength={2000}
                            disabled={loading}
                            placeholder="Describe your issue in detail..."
                            rows={6}
                            className="min-h-24 resize-none"
                            aria-invalid={fieldState.invalid}
                          />
                          <InputGroupAddon align="block-end">
                            <InputGroupText className="tabular-nums text-xs">
                              {detailsValue.length}/2000 characters
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormControl>
                      <FieldDescription>
                        Include steps to reproduce, expected behavior, and what
                        actually happened.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError
                          errors={
                            fieldState.error ? [fieldState.error] : undefined
                          }
                        />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

              <FormField
                control={form.control}
                name="files"
                render={({ fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="col-span-1 md:col-span-2"
                  >
                    <FieldLabel htmlFor="file-input">Attachments</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input
                          ref={fileInputRef}
                          id="file-input"
                          type="file"
                          accept={ALLOWED_SUPPORT_FILE_TYPES.join(",")}
                          multiple
                          disabled={
                            loading || selectedFiles.length >= MAX_SUPPORT_FILES
                          }
                          onChange={handleFileChange}
                          className="cursor-pointer"
                        />
                      </FormControl>
                      <FieldDescription className="text-xs">
                        JPEG, JPG, PNG, PDF, TXT (max 5MB each, up to{" "}
                        {MAX_SUPPORT_FILES} files)
                      </FieldDescription>
                      {selectedFiles.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {selectedFiles.map((file) => (
                            <div
                              key={`${file.name}-${file.size}-${file.lastModified}`}
                              className="flex items-center gap-2 p-2 border rounded-md bg-muted/50"
                            >
                              {getFileIcon(file)}
                              <span className="flex-1 text-sm truncate">
                                {file.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() =>
                                  handleRemoveFile(selectedFiles.indexOf(file))
                                }
                                disabled={loading}
                                aria-label="Remove file"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
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
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                aria-disabled={loading}
                aria-label={loading ? "Creating" : "Create Ticket"}
              >
                {loading ? (
                  <>
                    <Spinner /> Creating
                  </>
                ) : (
                  "Create Ticket"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
