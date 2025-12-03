"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldDescription, FieldLabel } from "@/components/ui/field";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { TeamAvatar } from "@/components/ui/team-avatar";
import { useUser } from "@/hooks/use-user";
import { axiosDeleteInstance, axiosPostInstance } from "@/lib/api-client";
import { REMOVE_TEAM_LOGO, UPLOAD_TEAM_LOGO } from "@/lib/api-routes";
import { genericError, permissionDeniedError } from "@/lib/errors";
import type {
  TeamLogoFormData,
  TeamLogoUploadResponse,
} from "@/lib/schemas/teams";
import {
  ALLOWED_LOGO_MIME_TYPES,
  MAX_LOGO_FILE_SIZE,
  teamLogoFormSchema,
  teamLogoUploadResponseSchema,
} from "@/lib/schemas/teams";

interface TeamLogoFormProps {
  initialLogoUrl: string | null;
}

export function TeamLogoForm({ initialLogoUrl }: TeamLogoFormProps) {
  const { updateActiveTeam, activeTeam } = useUser();
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isRemovingLogo, setIsRemovingLogo] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialLogoUrl,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update the avatar preview when the initial logo url changes
  useEffect(() => {
    setAvatarPreview(initialLogoUrl);
  }, [initialLogoUrl]);

  const form = useForm<TeamLogoFormData>({
    resolver: zodResolver(teamLogoFormSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const onSubmit = async (data: TeamLogoFormData) => {
    if (activeTeam.isMember) {
      toast.error(permissionDeniedError);
      return;
    }

    if (!data.file || isUploadingLogo) return;

    try {
      setIsUploadingLogo(true);

      const formData = new FormData();
      formData.append("file", data.file);

      const response = await axiosPostInstance<
        FormData,
        TeamLogoUploadResponse
      >(UPLOAD_TEAM_LOGO, formData, teamLogoUploadResponseSchema, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.logoUrl) {
        const newLogoUrl = response.data.logoUrl;
        setAvatarPreview(newLogoUrl);
        // Update context
        updateActiveTeam({ logo: newLogoUrl });
        form.reset({ file: undefined });
        // Clear the file input's internal state (file inputs can't be cleared via form.reset)
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        toast.success("Avatar uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading avatar", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (activeTeam.isMember) {
      toast.error(permissionDeniedError);
      return;
    }

    if (isRemovingLogo || !avatarPreview) return;

    try {
      setIsRemovingLogo(true);

      await axiosDeleteInstance(REMOVE_TEAM_LOGO);

      setAvatarPreview(null);
      // Update context
      updateActiveTeam({ logo: null });
      form.reset({ file: undefined });
      // Clear the file input's internal state (file inputs can't be cleared via form.reset)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Avatar removed successfully");
    } catch (error) {
      console.error("Error removing avatar", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setIsRemovingLogo(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel htmlFor="avatar-upload">Avatar</FieldLabel>
      <div className="flex items-center gap-4">
        {avatarPreview ? (
          <div className="relative flex size-20 items-center justify-center rounded-lg border overflow-hidden">
            <Image
              src={avatarPreview}
              alt={activeTeam?.name ?? ""}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex size-20 items-center justify-center">
            <TeamAvatar
              name={activeTeam?.name ?? ""}
              size="lg"
              className="size-20"
              textClassName="text-2xl"
            />
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="file"
              render={({
                field: { value, onChange, ...field },
                fieldState,
              }) => (
                <>
                  <FormControl>
                    <Input
                      {...field}
                      ref={fileInputRef}
                      type="file"
                      accept={ALLOWED_LOGO_MIME_TYPES.join(",")}
                      multiple={false}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);
                        if (file) {
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                      disabled={isUploadingLogo}
                      aria-invalid={fieldState.invalid}
                      className="hidden"
                    />
                  </FormControl>
                  {fieldState.error && (
                    <FieldDescription className="text-destructive">
                      {fieldState.error.message}
                    </FieldDescription>
                  )}
                </>
              )}
            />
            <div className="flex items-center gap-2">
              <Button
                type="button"
                id="avatar-upload"
                variant="outline"
                size="sm"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                disabled={isUploadingLogo}
              >
                {isUploadingLogo ? (
                  <>
                    <Spinner className="size-4" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="size-4" />{" "}
                    {avatarPreview ? "Change avatar" : "Upload avatar"}
                  </>
                )}
              </Button>
              {avatarPreview && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={handleRemoveLogo}
                  disabled={isRemovingLogo}
                  aria-label="Remove avatar"
                >
                  {isRemovingLogo ? (
                    <Spinner className="size-4" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              PNG, JPEG, or WebP. Max {MAX_LOGO_FILE_SIZE / (1024 * 1024)}MB.
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
