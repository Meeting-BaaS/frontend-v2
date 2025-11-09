"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Image, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
import { Field, FieldContent, FieldError } from "@/components/ui/field";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { axiosPostInstance } from "@/lib/api-client";
import { UPLOAD_ATTACHMENTS } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import {
  ALLOWED_SUPPORT_FILE_TYPES,
  MAX_SUPPORT_FILES,
  type UploadAttachmentsFormData,
  uploadAttachmentsFormSchema,
} from "@/lib/schemas/support";

interface UploadAttachmentsDialogProps {
  ticketId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadAttachmentsDialog({
  ticketId,
  open,
  onOpenChange,
}: UploadAttachmentsDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UploadAttachmentsFormData>({
    resolver: zodResolver(uploadAttachmentsFormSchema),
    defaultValues: {
      files: [],
    },
  });

  const onCancel = (updatedOpen: boolean) => {
    if (updatedOpen && loading) {
      return;
    }
    form.reset();
    setSelectedFiles([]);
    onOpenChange(updatedOpen);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...selectedFiles, ...files];

    setSelectedFiles(newFiles);
    form.setValue("files", newFiles, { shouldValidate: true });

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

  const onSubmit = async (data: UploadAttachmentsFormData) => {
    if (loading) return;

    try {
      setLoading(true);

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append("ticketId", ticketId);

      // Append files
      data.files.forEach((file) => {
        formData.append("files", file);
      });

      await axiosPostInstance<FormData, void>(
        UPLOAD_ATTACHMENTS,
        formData,
        undefined, // No response schema expected for 204 No Content
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Attachments uploaded successfully");
      form.reset();
      setSelectedFiles([]);
      onCancel(false);
      router.refresh();
    } catch (error) {
      console.error("Error uploading attachments", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Upload Attachments</DialogTitle>
          <DialogDescription>
            Upload additional files to this support ticket.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="files"
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
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
                    <div className="text-xs text-muted-foreground">
                      JPEG, JPG, PNG, PDF, TXT (max 5MB each, up to{" "}
                      {MAX_SUPPORT_FILES} files)
                    </div>
                    {selectedFiles.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {selectedFiles.map((file, index) => (
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
                              onClick={() => handleRemoveFile(index)}
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
                      errors={fieldState.error ? [fieldState.error] : undefined}
                    />
                  </FieldContent>
                </Field>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading || selectedFiles.length === 0}
                aria-busy={loading}
                aria-disabled={loading || selectedFiles.length === 0}
                aria-label={loading ? "Uploading" : "Upload"}
              >
                {loading ? (
                  <>
                    <Spinner /> Uploading
                  </>
                ) : (
                  <>
                    <Upload />
                    Upload
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
