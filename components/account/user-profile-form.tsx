"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FieldDescription, FieldLabel } from "@/components/ui/field";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useConfiguration } from "@/hooks/use-configuration";
import { useUser } from "@/hooks/use-user";
import { axiosDeleteInstance, axiosPostInstance } from "@/lib/api-client";
import { REMOVE_USER_IMAGE, UPLOAD_USER_IMAGE } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import type {
  UserImageFormData,
  UserImageUploadResponse,
} from "@/lib/schemas/account";
import {
  ALLOWED_USER_IMAGE_MIME_TYPES,
  MAX_USER_IMAGE_FILE_SIZE,
  userImageFormSchema,
  userImageUploadResponseSchema,
} from "@/lib/schemas/account";

export function UserProfileForm() {
  const { configuration } = useConfiguration();
  const { user, updateUser } = useUser();
  const isLogoBucketConfigured = configuration?.isLogoBucketConfigured ?? true;
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isRemovingImage, setIsRemovingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(user.image);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update the image preview when the user image changes
  useEffect(() => {
    setImagePreview(user.image);
  }, [user.image]);

  const form = useForm<UserImageFormData>({
    resolver: zodResolver(userImageFormSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const onSubmit = async (data: UserImageFormData) => {
    if (!data.file || isUploadingImage) return;

    try {
      setIsUploadingImage(true);

      const formData = new FormData();
      formData.append("file", data.file);

      const response = await axiosPostInstance<
        FormData,
        UserImageUploadResponse
      >(UPLOAD_USER_IMAGE, formData, userImageUploadResponseSchema, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.imageUrl) {
        const newImageUrl = response.data.imageUrl;
        setImagePreview(newImageUrl);
        // Update context
        updateUser({ image: newImageUrl });
        form.reset({ file: undefined });
        // Clear the file input's internal state
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        toast.success("Profile image uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading profile image", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (isRemovingImage || !imagePreview) return;

    try {
      setIsRemovingImage(true);

      await axiosDeleteInstance(REMOVE_USER_IMAGE);

      setImagePreview(null);
      // Update context
      updateUser({ image: null });
      form.reset({ file: undefined });
      // Clear the file input's internal state
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Avatar removed successfully");
    } catch (error) {
      console.error("Error removing avatar", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setIsRemovingImage(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel htmlFor="avatar-upload">Profile image</FieldLabel>
      <div className="flex items-center gap-4">
        {imagePreview ? (
          <div className="relative flex size-20 items-center justify-center rounded-full border overflow-hidden">
            <Avatar className="size-20">
              <AvatarImage src={imagePreview} alt={user.name} />
            </Avatar>
          </div>
        ) : (
          <div className="flex size-20 items-center justify-center rounded-full">
            <Avatar className="size-20">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-baas-primary-500 via-baas-primary-700 to-baas-black text-white font-bold text-2xl">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
        {isLogoBucketConfigured && (
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
                        accept={ALLOWED_USER_IMAGE_MIME_TYPES.join(",")}
                        multiple={false}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file);
                          if (file) {
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                        disabled={isUploadingImage}
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
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? (
                    <>
                      <Spinner className="size-4" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="size-4" />{" "}
                      {imagePreview
                        ? "Change profile image"
                        : "Upload profile image"}
                    </>
                  )}
                </Button>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={handleRemoveImage}
                    disabled={isRemovingImage}
                    aria-label="Remove profile image"
                  >
                    {isRemovingImage ? (
                      <Spinner className="size-4" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                PNG, JPEG, or WebP. Max {MAX_USER_IMAGE_FILE_SIZE / (1024 * 1024)}
                MB.
              </p>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
