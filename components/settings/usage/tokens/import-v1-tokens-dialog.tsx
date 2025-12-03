"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/hooks/use-user";
import { axiosGetInstance, axiosPostInstance } from "@/lib/api-client";
import {
  GET_V1_AVAILABLE_TOKENS,
  IMPORT_TOKENS_FROM_V1,
} from "@/lib/api-routes";
import { genericError } from "@/lib/errors";
import {
  type GetV1AvailableTokensResponse,
  getV1AvailableTokensResponseSchema,
  type ImportTokensFromV1Request,
  type ImportTokensFromV1Response,
  importTokensFromV1RequestSchema,
  importTokensFromV1ResponseSchema,
} from "@/lib/schemas/settings";

interface ImportV1TokensDialogProps {
  children: React.ReactNode;
}

export function ImportV1TokensDialog({ children }: ImportV1TokensDialogProps) {
  const router = useRouter();
  const { activeTeam } = useUser();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingAvailable, setFetchingAvailable] = useState(false);
  const [availableTokens, setAvailableTokens] = useState<string | null>(null);

  const form = useForm<ImportTokensFromV1Request>({
    resolver: zodResolver(importTokensFromV1RequestSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const fetchAvailableTokens = useCallback(async () => {
    try {
      setFetchingAvailable(true);
      const response = await axiosGetInstance<GetV1AvailableTokensResponse>(
        GET_V1_AVAILABLE_TOKENS,
        getV1AvailableTokensResponseSchema,
      );

      if (response?.success && response.data) {
        setAvailableTokens(response.data.availableTokens);
      }
    } catch (error) {
      console.error("Error fetching v1 available tokens", error);
      // Don't show error toast - just set to 0
      setAvailableTokens("0");
    } finally {
      setFetchingAvailable(false);
    }
  }, []);

  // Fetch available tokens when dialog opens
  useEffect(() => {
    if (open) {
      fetchAvailableTokens();
    }
  }, [open, fetchAvailableTokens]);

  const onSubmit = async (data: ImportTokensFromV1Request) => {
    if (loading) return;

    if (!availableTokens || parseFloat(availableTokens) === 0) {
      toast.error("No tokens available in v1 account");
      return;
    }

    const available = parseFloat(availableTokens);
    if (data.amount > available) {
      toast.error(
        `You only have ${available.toFixed(2)} tokens available in v1`,
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axiosPostInstance<
        ImportTokensFromV1Request,
        ImportTokensFromV1Response
      >(IMPORT_TOKENS_FROM_V1, data, importTokensFromV1ResponseSchema);

      if (!response || !response.success) {
        console.error("Failed to import tokens", response);
        throw new Error("Failed to import tokens");
      }

      const { tokensImported, newBalance } = response.data;

      toast.success(
        `Successfully imported ${parseFloat(tokensImported).toFixed(2)} tokens. New balance: ${parseFloat(newBalance).toFixed(2)}`,
      );

      setOpen(false);
      form.reset({ amount: 0 });
      setAvailableTokens(null);

      // Refresh the page to update token balance
      router.refresh();
    } catch (error) {
      console.error("Error importing tokens", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset({ amount: 0 });
      setAvailableTokens(null);
    }
    setOpen(open);
  };

  const available = availableTokens ? parseFloat(availableTokens) : 0;
  const hasTokens = available > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Tokens from v1</DialogTitle>
          <DialogDescription>
            Transfer your remaining tokens from Meeting BaaS v1 to v2. The
            imported tokens will be added to {activeTeam.name} team's token
            balance.{" "}
            <span className="font-bold">This action cannot be undone.</span>
          </DialogDescription>
        </DialogHeader>
        {fetchingAvailable ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Available tokens to import:{" "}
                  <span className="font-semibold">
                    {available.toFixed(2)} tokens
                  </span>
                </p>
                {!hasTokens && open && (
                  <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertDescription>
                      You don&apos;t have any tokens available in your v1
                      account.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="amount">Amount to Import</FieldLabel>
                    <FieldContent>
                      <FormControl>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          min="0"
                          max={available}
                          placeholder="0.00"
                          disabled={!hasTokens || loading}
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FieldError />
                    </FieldContent>
                  </Field>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={loading}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={loading || !hasTokens}>
                  {loading ? (
                    <>
                      <Spinner />
                      Importing...
                    </>
                  ) : (
                    "Import Tokens"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
