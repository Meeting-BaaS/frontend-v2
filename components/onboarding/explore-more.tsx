"use client";

import { ArrowRight, Calendar, CalendarClock, Webhook } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { GradientIcon } from "@/components/ui/gradient-icon";

interface ExploreCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  recommended?: boolean;
}

const exploreCards: ExploreCard[] = [
  {
    title: "Add a Webhook",
    description:
      "Receive real-time notifications when your bots complete recording or encounter errors.",
    icon: Webhook,
    href: "/webhooks",
    recommended: true,
  },
  {
    title: "Schedule Bots",
    description:
      "Schedule bots to automatically join meetings at specific times in the future.",
    icon: CalendarClock,
    href: "/scheduled-bots",
  },
  {
    title: "Calendar Bots",
    description:
      "Automatically send bots to join meetings from your connected calendar. Bots will join meetings based on your calendar events.",
    icon: Calendar,
    href: "/calendars",
  },
];

export function ExploreMore() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Explore More</h2>
        <p className="text-sm text-muted-foreground">
          Discover additional features to enhance your Meeting BaaS experience
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {exploreCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group relative block rounded-lg border border-border bg-background p-6 transition-all"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <GradientIcon color="var(--color-background)" size="lg">
                  <card.icon className="size-6 text-primary" />
                </GradientIcon>
              </div>
              {card.recommended && (
                <Badge variant="secondary" className="text-xs">
                  Recommended
                </Badge>
              )}
            </div>
            <h3 className="mb-2 font-semibold">{card.title}</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {card.description}
            </p>
            <div className="flex items-center text-sm font-medium text-primary group-hover:underline">
              Learn more
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
