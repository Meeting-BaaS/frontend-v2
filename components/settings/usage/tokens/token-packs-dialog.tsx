"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { InvoicePaymentDialog } from "@/components/settings/usage/tokens/invoice-payment-dialog";
import { Button } from "@/components/ui/button";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { usePlans } from "@/hooks/use-plans";
import { useUser } from "@/hooks/use-user";
import { axiosPostInstance } from "@/lib/api-client";
import { PURCHASE_TOKEN_PACK } from "@/lib/api-routes";
import { formatCurrency } from "@/lib/currency-helpers";
import { genericError, permissionDeniedError } from "@/lib/errors";
import {
  type PurchaseTokenPack,
  type PurchaseTokenPackResponse,
  purchaseTokenPackResponseSchema,
} from "@/lib/schemas/settings";

const formSchema = z.object({
  packId: z.string().min(1, "You must select a token pack to continue."),
});

interface TokenPacksDialogProps {
  children: React.ReactNode;
}

export function TokenPacksDialog({ children }: TokenPacksDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState<string>("");
  const { tokenPacks, tokenPacksLoading } = usePlans();
  const { activeTeam } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packId: "",
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
    }
  };

  // Memoize token packs with calculated prices
  const tokenPacksWithPrices = useMemo(
    () =>
      tokenPacks.map((pack) => {
        const discountMultiplier = 1 - pack.discountPercentage / 100;
        const discountedPrice = Math.round(
          pack.originalPrice * discountMultiplier,
        );
        const hasDiscount = pack.discountPercentage > 0;
        const originalPerTokenPrice = Math.round(
          pack.originalPrice / pack.tokens,
        );
        const discountedPerTokenPrice = Math.round(
          discountedPrice / pack.tokens,
        );
        return {
          ...pack,
          discountedPrice,
          hasDiscount,
          originalPerTokenPrice,
          discountedPerTokenPrice,
        };
      }),
    [tokenPacks],
  );

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (activeTeam.isMember) {
      toast.error(permissionDeniedError);
      return;
    }

    if (isPurchasing) return;

    const selectedPack = tokenPacks.find((pack) => pack.id === data.packId);
    if (!selectedPack) {
      toast.error("Selected token pack not found");
      return;
    }

    try {
      setIsPurchasing(true);

      const purchaseData: PurchaseTokenPack = {
        priceId: selectedPack.priceId,
      };

      const response = await axiosPostInstance<
        PurchaseTokenPack,
        PurchaseTokenPackResponse
      >(PURCHASE_TOKEN_PACK, purchaseData, purchaseTokenPackResponseSchema);

      if (response?.data.hostedInvoiceUrl) {
        // Store invoice URL and open instruction dialog
        setInvoiceUrl(response.data.hostedInvoiceUrl);
        // Close the purchase dialog
        setOpen(false);
        // Open the invoice payment instruction dialog
        setInvoiceDialogOpen(true);
        // Open the hosted invoice URL in a new tab
        window.open(response.data.hostedInvoiceUrl, "_blank");
      } else {
        toast.error("Failed to get invoice URL");
      }
    } catch (error) {
      console.error("Error purchasing token pack", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Buy Tokens</DialogTitle>
          <DialogDescription>
            Select a token pack to purchase. You can buy additional packs at any
            time.
          </DialogDescription>
        </DialogHeader>
        {tokenPacksLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="size-8" />
          </div>
        ) : (
          <form id="token-packs-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="packId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FieldSet data-invalid={fieldState.invalid}>
                    <RadioGroup
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      aria-invalid={fieldState.invalid}
                    >
                      {tokenPacksWithPrices.map((pack) => (
                        <FieldLabel
                          key={pack.id}
                          htmlFor={`token-pack-${pack.id}`}
                        >
                          <Field
                            orientation="horizontal"
                            data-invalid={fieldState.invalid}
                          >
                            <FieldContent className="flex-1">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                  <FieldTitle>
                                    {pack.name} Pack (
                                    {pack.tokens.toLocaleString()} tokens)
                                  </FieldTitle>
                                  <FieldDescription>
                                    {pack.hasDiscount ? (
                                      <>
                                        <span className="text-muted-foreground line-through mr-2">
                                          {formatCurrency(
                                            pack.originalPrice,
                                            "usd",
                                          )}
                                        </span>
                                        <span className="font-semibold">
                                          {formatCurrency(
                                            pack.discountedPrice,
                                            "usd",
                                          )}
                                        </span>
                                        {" • "}
                                        <span className="text-muted-foreground line-through">
                                          {formatCurrency(
                                            pack.originalPerTokenPrice,
                                            "usd",
                                          )}
                                        </span>
                                        <span className="ml-1">
                                          {formatCurrency(
                                            pack.discountedPerTokenPrice,
                                            "usd",
                                          )}
                                        </span>
                                        /token
                                      </>
                                    ) : (
                                      <>
                                        {formatCurrency(
                                          pack.discountedPrice,
                                          "usd",
                                        )}{" "}
                                        •{" "}
                                        {formatCurrency(
                                          pack.discountedPerTokenPrice,
                                          "usd",
                                        )}
                                        /token
                                      </>
                                    )}
                                  </FieldDescription>
                                </div>
                                <RadioGroupItem
                                  value={pack.id}
                                  id={`token-pack-${pack.id}`}
                                  aria-invalid={fieldState.invalid}
                                />
                              </div>
                            </FieldContent>
                          </Field>
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldSet>
                )}
              />
            </FieldGroup>
          </form>
        )}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen(false);
              form.reset();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="token-packs-form"
            disabled={isPurchasing || !form.formState.isValid}
          >
            {isPurchasing ? (
              <>
                <Spinner className="size-4" />
                Processing...
              </>
            ) : (
              "Purchase Pack"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
      <InvoicePaymentDialog
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
        invoiceUrl={invoiceUrl}
      />
    </Dialog>
  );
}
