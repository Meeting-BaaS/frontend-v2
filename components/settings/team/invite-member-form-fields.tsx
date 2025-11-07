"use client";

import { Info } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { InviteMemberFormData } from "@/lib/schemas/teams";

interface InviteMemberFormFieldsProps {
  loading: boolean;
}

export function InviteMemberFormFields({
  loading,
}: InviteMemberFormFieldsProps) {
  const form = useFormContext<InviteMemberFormData>();

  return (
    <FieldGroup>
      <FormField
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Email</FieldLabel>
            <FieldContent>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  autoComplete="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="colleague@example.com"
                  aria-label="Team member email address"
                  disabled={loading}
                />
              </FormControl>
              <FieldError
                errors={fieldState.error ? [fieldState.error] : undefined}
              />
            </FieldContent>
          </Field>
        )}
      />

      <FormField
        control={form.control}
        name="role"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor={field.name}
              className="flex items-center gap-2"
            >
              Role
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1 text-sm">
                      <div>
                        <strong>Admin:</strong> Invite users, update payment,
                        and delete the team.
                      </div>
                      <div>
                        <strong>Member:</strong> Manage bots, calendars, api
                        keys and webhooks.
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FieldLabel>
            <FieldContent>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full" id={field.name}>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FieldError
                errors={fieldState.error ? [fieldState.error] : undefined}
              />
            </FieldContent>
          </Field>
        )}
      />
    </FieldGroup>
  );
}
