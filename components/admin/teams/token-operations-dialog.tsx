"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { axiosPostInstance } from "@/lib/api-client";
import { ADMIN_TOKEN_OPERATIONS } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import {
  type TokenOperationsRequest,
  tokenOperationsRequestSchema,
} from "@/lib/schemas/admin";

interface TokenOperationsDialogProps {
  teamId: number;
  currentBalance: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TokenOperationsDialog({
  teamId,
  currentBalance,
  open,
  onOpenChange,
}: TokenOperationsDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<TokenOperationsRequest>({
    resolver: zodResolver(tokenOperationsRequestSchema),
    defaultValues: {
      operation: "gift",
      amount: 0,
      reason: "",
    },
  });

  const onSubmit = async (data: TokenOperationsRequest) => {
    if (loading) return;

    try {
      setLoading(true);
      await axiosPostInstance(ADMIN_TOKEN_OPERATIONS(teamId), data, undefined);
      toast.success(
        `Tokens ${data.operation === "gift" ? "gifted" : "refunded"} successfully`,
      );
      router.refresh();
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error performing token operation", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Token Operations</DialogTitle>
          <DialogDescription>
            Gift or refund tokens to this team. Current balance:{" "}
            {currentBalance.toFixed(2)} tokens.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
              <FormField
                control={form.control}
                name="operation"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="operation">Operation</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={loading}
                        >
                          <SelectTrigger id="operation" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gift">Gift</SelectItem>
                            <SelectItem value="refund">Refund</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FieldError
                        errors={
                          fieldState.error ? [fieldState.error] : undefined
                        }
                      />
                    </FieldContent>
                  </Field>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="amount">Amount (tokens)</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          id="amount"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value, 10))
                          }
                          disabled={loading}
                        />
                      </FormControl>
                      <FieldError
                        errors={
                          fieldState.error ? [fieldState.error] : undefined
                        }
                      />
                    </FieldContent>
                  </Field>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="reason">Reason (optional)</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Textarea
                          {...field}
                          id="reason"
                          disabled={loading}
                          placeholder="Reason for this operation..."
                        />
                      </FormControl>
                      <FieldError
                        errors={
                          fieldState.error ? [fieldState.error] : undefined
                        }
                      />
                    </FieldContent>
                  </Field>
                )}
              />
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading} aria-busy={loading}>
                {loading ? <Spinner /> : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
