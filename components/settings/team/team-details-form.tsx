"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import type { UpdateTeamName } from "@/lib/schemas/teams";
import { updateTeamNameSchema } from "@/lib/schemas/teams";

interface TeamDetailsFormProps {
  teamId: number;
  initialName: string;
}

export function TeamDetailsForm({ teamId, initialName }: TeamDetailsFormProps) {
  const { updateTeam } = useUser();
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const form = useForm<UpdateTeamName>({
    resolver: zodResolver(updateTeamNameSchema),
    defaultValues: {
      name: initialName,
    },
  });

  const isDirty = form.formState.isDirty;

  const onSubmit = async (data: UpdateTeamName) => {
    if (isUpdatingName) return;
    try {
      setIsUpdatingName(true);

      await authClient.organization.update({
        organizationId: teamId.toString(),
        data: {
          name: data.name,
        },
      });

      // Update context
      updateTeam(teamId, { name: data.name });

      form.reset({
        name: data.name,
      });

      toast.success("Team name updated successfully");
    } catch (error) {
      console.error("Error updating team name", error);
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
            <FieldLabel htmlFor="name">Team Name</FieldLabel>
            <Input
              id="name"
              type="text"
              autoComplete="off"
              {...form.register("name")}
              aria-invalid={!!form.formState.errors.name}
              className="md:!w-1/2 lg:!w-2/5"
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
              "Update name"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
