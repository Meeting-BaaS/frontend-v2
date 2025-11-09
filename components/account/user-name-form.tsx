"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/hooks/use-user";
import { authClient } from "@/lib/auth-client";
import { genericError } from "@/lib/errors";
import type { UpdateUserName } from "@/lib/schemas/account";
import { updateUserNameSchema } from "@/lib/schemas/account";

export function UserNameForm() {
  const { user, updateUser } = useUser();
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const form = useForm<UpdateUserName>({
    resolver: zodResolver(updateUserNameSchema),
    defaultValues: {
      name: user.name,
    },
  });

  const {
    formState: { isDirty },
    reset,
  } = form;

  useEffect(() => {
    reset({
      name: user.name,
    });
  }, [user.name, reset]);

  const onSubmit = async (data: UpdateUserName) => {
    if (isUpdatingName) return;
    try {
      setIsUpdatingName(true);

      await authClient.updateUser({
        name: data.name,
      });

      // Update context
      updateUser({ name: data.name });

      reset({
        name: data.name,
      });

      toast.success("Name updated successfully");
    } catch (error) {
      console.error("Error updating name", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setIsUpdatingName(false);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              className="w-full md:!w-1/2 lg:!w-2/5"
              {...form.register("name")}
              aria-invalid={!!form.formState.errors.name}
            />
            {form.formState.errors.name && (
              <FieldDescription className="text-destructive">
                {form.formState.errors.name.message}
              </FieldDescription>
            )}
          </Field>
          <Button
            type="submit"
            size="sm"
            disabled={isUpdatingName || !isDirty}
            className="w-full sm:w-fit"
          >
            {isUpdatingName ? (
              <>
                <Spinner /> Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
