"use client";

import { groupBy } from "lodash-es";
import { Check, ChevronsUpDown, Info } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WEBHOOK_TEST_URL } from "@/lib/external-urls";
import { cn } from "@/lib/utils";

interface FormFieldsProps {
  loading: boolean;
  allEventTypes: string[];
}

interface EventsComboboxProps {
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
  options: string[];
  disabled?: boolean;
  hasError?: boolean;
  id: string;
}

function EventsCombobox({
  selectedValues,
  onValueChange,
  options,
  disabled,
  hasError,
  id,
}: EventsComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (currentValue: string) => {
    const isSelected = selectedValues.includes(currentValue);
    const newValues = isSelected
      ? selectedValues.filter((val) => val !== currentValue)
      : [...selectedValues, currentValue];
    onValueChange(newValues);
  };

  // Group events by prefix (e.g., "bot.*", "calendar.*")
  const groupedEvents = React.useMemo(() => {
    return groupBy(options, (event) => event.split(".")[0]);
  }, [options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={hasError}
          className={cn(
            "w-full justify-between min-h-[2.5rem] h-auto",
            hasError &&
              "!border-destructive focus-visible:!ring-destructive/20 dark:focus-visible:!ring-destructive/40",
          )}
          disabled={disabled}
          id={id}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {selectedValues.length === 0 && (
              <span className="text-muted-foreground">Select events...</span>
            )}
            {selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedValues.map((value) => (
                  <Badge key={value} variant="secondary" className="text-xs">
                    {value}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search events..." />
          <CommandList>
            <CommandEmpty>No events found.</CommandEmpty>
            {Object.entries(groupedEvents).map(([prefix, events]) => (
              <CommandGroup
                key={prefix}
                className="[&_[cmdk-group-heading]]:capitalize"
                heading={prefix}
              >
                {events.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => handleSelect(option)}
                  >
                    {option}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedValues.includes(option)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function FormFields({ loading, allEventTypes }: FormFieldsProps) {
  const form = useFormContext();

  return (
    <FieldGroup>
      <FormField
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Name (optional)</FieldLabel>
            <FieldContent>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  placeholder="My Webhook"
                  aria-label="Webhook name"
                  maxLength={255}
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
        name="endpointUrl"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              Endpoint URL{" "}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1 text-sm">
                      For a quick test, you can get a temporary webhook URL from{" "}
                      <Button
                        variant="link"
                        asChild
                        className="h-auto p-0 text-inherit underline decoration-dashed hover:decoration-baas-primary-500 hover:decoration-solid"
                      >
                        <Link
                          href={WEBHOOK_TEST_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {WEBHOOK_TEST_URL}
                        </Link>
                      </Button>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FieldLabel>
            <FieldContent>
              <FormControl>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  type="url"
                  placeholder="https://example.com/webhook"
                  aria-label="Endpoint URL"
                  maxLength={2048}
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
        name="events"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor={field.name}
              className="flex items-center gap-2"
            >
              Events
            </FieldLabel>
            <FieldContent>
              <FormControl>
                <EventsCombobox
                  id={field.name}
                  selectedValues={field.value}
                  onValueChange={field.onChange}
                  options={allEventTypes}
                  disabled={loading}
                  hasError={!!fieldState.error}
                />
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
