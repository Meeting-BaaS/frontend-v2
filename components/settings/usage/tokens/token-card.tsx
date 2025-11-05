"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { formatCurrency } from "@/lib/currency-helpers";
import type { TokenPack } from "@/lib/schemas/settings";

interface TokenCardProps {
  pack: TokenPack;
  onPurchase: (pack: TokenPack) => void;
  isPurchasing?: boolean;
}

export function TokenCard({
  pack,
  onPurchase,
  isPurchasing = false,
}: TokenCardProps) {
  // Calculate discounted price
  const discountMultiplier = 1 - pack.discountPercentage / 100;
  const discountedPrice = Math.round(pack.originalPrice * discountMultiplier);
  const hasDiscount = pack.discountPercentage > 0;

  // Calculate per-token prices
  const originalPerTokenPrice = Math.round(pack.originalPrice / pack.tokens);
  const discountedPerTokenPrice = Math.round(discountedPrice / pack.tokens);

  const isBestValue = pack.name === "Infinity";
  return (
    <Card className="relative h-full">
      <CardHeader>
        {isBestValue && (
          <Badge
            variant="secondary"
            className="absolute -top-3 left-1/2 -translate-x-1/2"
          >
            Best Value
          </Badge>
        )}
        <CardTitle className="flex items-center justify-between gap-2">
          {pack.name}
          <span className="text-muted-foreground text-sm">
            {hasDiscount ? (
              <>
                <span className="line-through">
                  {formatCurrency(originalPerTokenPrice, "usd")}
                </span>
                <span className="ml-1">
                  {formatCurrency(discountedPerTokenPrice, "usd")}
                </span>
                <span className="ml-1">/token</span>
              </>
            ) : (
              <span>
                {formatCurrency(discountedPerTokenPrice, "usd")}/token
              </span>
            )}
          </span>
        </CardTitle>
        <CardDescription className="mt-4 flex items-baseline">
          {hasDiscount ? (
            <>
              <span className="mr-2 text-muted-foreground line-through">
                {formatCurrency(pack.originalPrice, "usd")}
              </span>
              <span className="font-bold text-3xl text-foreground">
                {formatCurrency(discountedPrice, "usd")}
              </span>
            </>
          ) : (
            <span className="font-bold text-3xl text-foreground">
              {formatCurrency(discountedPrice, "usd")}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="grow">
        <div className="flex items-end gap-1">
          <span className="font-bold text-4xl text-primary">{pack.tokens}</span>
          <span className="pb-0.5 text-muted-foreground">tokens</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant="outline"
          onClick={() => onPurchase(pack)}
          disabled={isPurchasing}
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
      </CardFooter>
    </Card>
  );
}
