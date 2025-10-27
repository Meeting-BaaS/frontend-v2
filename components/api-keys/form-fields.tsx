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
import { permissionsEnum } from "@/lib/schemas/api-keys";

interface FormFieldsProps {
  loading: boolean;
}

export function FormFields({ loading }: FormFieldsProps) {
  const form = useFormContext();

  return (
    <FieldGroup>
      <FormField
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Name</FieldLabel>
            <FieldContent>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  placeholder="Your API Key name"
                  aria-label="Your API Key name"
                  maxLength={50}
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
        name="permissions"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor={field.name}
              className="flex items-center gap-2"
            >
              Permission
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1 text-sm">
                      <div>
                        <strong>Full access:</strong> allows to get, create, and
                        delete any bot.
                      </div>
                      <div>
                        <strong>Sending access:</strong> allows to only send
                        bots.
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
                    <SelectValue placeholder="Select permissions" />
                  </SelectTrigger>
                  <SelectContent>
                    {permissionsEnum.map((permission) => (
                      <SelectItem key={permission} value={permission}>
                        {permission}
                      </SelectItem>
                    ))}
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
