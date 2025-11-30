"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { endOfDay, startOfDay, subDays } from "date-fns";
import type { ReactNode } from "react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { axiosPostInstance } from "@/lib/api-client";
import { ADMIN_MIGRATE_USERS } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import {
  type AdminUserMigrationFormData,
  type AdminUserMigrationResponse,
  adminUserMigrationFormSchema,
  adminUserMigrationResponseSchema,
} from "@/lib/schemas/admin";

interface ImportUsersDialogProps {
  children: ReactNode;
}

export function ImportUsersDialog({ children }: ImportUsersDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Default to last 6 months (180 days)
  const defaultDateRange: DateRange = {
    from: startOfDay(subDays(new Date(), 180)),
    to: endOfDay(new Date()),
  };

  const form = useForm<AdminUserMigrationFormData>({
    resolver: zodResolver(adminUserMigrationFormSchema),
    defaultValues: {
      botsCreatedAfter: defaultDateRange.from?.toISOString() ?? "",
      botsCreatedBefore: defaultDateRange.to?.toISOString() ?? "",
    },
  });

  const dateRange: DateRange = {
    from: form.watch("botsCreatedAfter")
      ? new Date(form.watch("botsCreatedAfter"))
      : undefined,
    to: form.watch("botsCreatedBefore")
      ? new Date(form.watch("botsCreatedBefore"))
      : undefined,
  };

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    if (newDateRange?.from) {
      form.setValue(
        "botsCreatedAfter",
        startOfDay(newDateRange.from).toISOString(),
        {
          shouldValidate: true,
        },
      );
    } else {
      form.setValue("botsCreatedAfter", "", { shouldValidate: true });
    }
    if (newDateRange?.to) {
      form.setValue(
        "botsCreatedBefore",
        endOfDay(newDateRange.to).toISOString(),
        {
          shouldValidate: true,
        },
      );
    } else {
      form.setValue("botsCreatedBefore", "", { shouldValidate: true });
    }
  };

  const onSubmit = async (data: AdminUserMigrationFormData) => {
    if (loading) return;

    try {
      setLoading(true);

      const response = await axiosPostInstance<
        AdminUserMigrationFormData,
        AdminUserMigrationResponse
      >(ADMIN_MIGRATE_USERS, data, adminUserMigrationResponseSchema);

      if (!response || !response.success) {
        console.error("Failed to migrate users", response);
        throw new Error("Failed to migrate users");
      }

      const { totalProcessed, totalSuccess, totalErrors, erroredEmails } =
        response.data;

      // Show success message with details
      if (totalErrors === 0) {
        toast.success(
          `Successfully migrated ${totalSuccess} user${totalSuccess !== 1 ? "s" : ""}`,
        );
      } else {
        toast.success(
          `Migration completed: ${totalSuccess} succeeded, ${totalErrors} failed, ${totalProcessed} total`,
        );
        if (erroredEmails.length > 0) {
          console.warn("Failed emails:", erroredEmails);
        }
      }

      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error migrating users", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Users from v1</DialogTitle>
          <DialogDescription>
            Migrate users from v1 to v2 based on bot creation date range. Users
            who created bots within the selected date range will be migrated.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="botsCreatedAfter"
              render={() => (
                <Field>
                  <FieldLabel>Bot Creation Date Range</FieldLabel>
                  <FieldContent>
                    <FormControl>
                      <DateRangePicker
                        dateRange={dateRange}
                        setDateRange={handleDateRangeChange}
                        disabled={{
                          before: subDays(new Date(), 365), // Allow up to 1 year ago
                          after: new Date(),
                        }}
                      />
                    </FormControl>
                    <FieldError />
                  </FieldContent>
                </Field>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner />
                    Migrating...
                  </>
                ) : (
                  "Import Users"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
