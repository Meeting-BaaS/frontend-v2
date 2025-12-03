"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@/hooks/use-user";
import { authClient } from "@/lib/auth-client";
import { genericError, permissionDeniedError } from "@/lib/errors";
import type { UpdateTeamName } from "@/lib/schemas/teams";
import { updateTeamNameSchema } from "@/lib/schemas/teams";

interface TeamDetailsFormProps {
  teamId: number;
  initialName: string;
}

export function TeamDetailsForm({ teamId, initialName }: TeamDetailsFormProps) {
  const { updateActiveTeam, activeTeam } = useUser();
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const form = useForm<UpdateTeamName>({
    resolver: zodResolver(updateTeamNameSchema),
    defaultValues: {
      name: initialName,
    },
  });

  const {
    formState: { isDirty },
    reset,
  } = form;

  useEffect(() => {
    reset({
      name: initialName,
    });
  }, [initialName, reset]);

  const onSubmit = async (data: UpdateTeamName) => {
    if (activeTeam.isMember) {
      toast.error(permissionDeniedError);
      return;
    }

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
      updateActiveTeam({ name: data.name });

      reset({
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
          <div className="flex items-center flex-col sm:flex-row gap-2 w-full">
            <Field>
              <FieldLabel htmlFor="name">Team Name</FieldLabel>
              <Input
                id="name"
                type="text"
                autoComplete="off"
                {...form.register("name")}
                aria-invalid={!!form.formState.errors.name}
              />
              {form.formState.errors.name && (
                <FieldDescription className="text-destructive">
                  {form.formState.errors.name.message}
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="region" className="flex items-center gap-2">
                Region{" "}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      Data is stored in the region specified. Default region is
                      'eu-west-3' (Paris, France). Additional regions are coming
                      soon.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FieldLabel>
              <Input
                id="region"
                type="text"
                autoComplete="off"
                readOnly
                disabled
                className="w-full md:!w-1/2 lg:!w-2/5"
                value={activeTeam.region || "eu-west-3"}
              />
            </Field>
          </div>
          <Button
            variant="primary"
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
