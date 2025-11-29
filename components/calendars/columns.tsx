"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { GoogleLogo } from "@/components/icons/google";
import { MicrosoftLogo } from "@/components/icons/microsoft";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { formatRelativeDate } from "@/lib/date-helpers";
import { formatCalendarConnectionStatus } from "@/lib/formatters/calendars";
import type { CalendarListEntry } from "@/lib/schemas/calendars";
import { cn } from "@/lib/utils";

export const calendarColumnWidths = {
  calendar_id: "min-w-[320px] max-w-[400px] w-[40%]",
  account_email: "min-w-[280px] max-w-[350px] w-[30%]",
  status: "min-w-[120px] max-w-[140px] w-[12%]",
  created_at: "min-w-[160px] max-w-[180px] w-[18%]",
  synced_at: "min-w-[160px] max-w-[180px] w-[18%]",
} as const;

export const calendarStatusVariants = cva("capitalize", {
  variants: {
    status: {
      active: "bg-green-500/10 text-green-500 fill-green-500",
      error: "bg-red-500/10 text-red-500 fill-red-500",
      revoked: "bg-slate-500/10 text-slate-500 fill-slate-500",
      permission_denied: "bg-amber-500/10 text-amber-500 fill-amber-500",
    },
  },
  defaultVariants: {
    status: "active",
  },
});

export const subscriptionStatusVariants = cva("capitalize", {
  variants: {
    status: {
      active: "bg-green-500/10 text-green-500 fill-green-500",
      error: "bg-red-500/10 text-red-500 fill-red-500",
      revoked: "bg-slate-500/10 text-slate-500 fill-slate-500",
      permission_denied: "bg-amber-500/10 text-amber-500 fill-amber-500",
    },
  },
  defaultVariants: {
    status: "active",
  },
});

export const calendarColumns: ColumnDef<CalendarListEntry>[] = [
  {
    id: "calendar_id",
    accessorKey: "calendar_id",
    header: "Calendar ID",
    meta: {
      className: calendarColumnWidths.calendar_id,
    },
    cell: ({ row }) => {
      return (
        <div className="flex gap-1 items-center group">
          <Button variant="link" asChild className="p-0">
            <Link
              href={`/calendars/${row.original.calendar_id}`}
              prefetch={false}
              className="flex gap-3 items-center decoration-dashed underline group-hover:decoration-baas-primary-500 group-hover:decoration-solid"
            >
              <GradientIcon color="var(--color-background)">
                {row.original.calendar_platform === "google" ? (
                  <GoogleLogo className="fill-google-blue" />
                ) : (
                  <MicrosoftLogo className="fill-mi" />
                )}
              </GradientIcon>
              <span className="truncate max-w-sm">
                {row.original.calendar_id}
              </span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="opacity-0 -translate-x-2 delay-200 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          >
            <CopyButton text={row.original.calendar_id} />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "account_email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original.account_email;
      return (
        <div className="flex items-center gap-2 group">
          <span className="truncate max-w-sm">{email}</span>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="opacity-0 -translate-x-2 delay-200 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          >
            <CopyButton text={email} />
          </Button>
        </div>
      );
    },
    meta: {
      className: calendarColumnWidths.account_email,
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge className={cn(calendarStatusVariants({ status }))}>
          {formatCalendarConnectionStatus(status)}
        </Badge>
      );
    },
    meta: {
      className: calendarColumnWidths.status,
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      return <div className="capitalize">{formatRelativeDate(createdAt)}</div>;
    },
    meta: {
      className: calendarColumnWidths.created_at,
    },
  },
  {
    accessorKey: "synced_at",
    header: "Last Synced",
    cell: ({ row }) => {
      const syncedAt = row.original.synced_at;
      if (!syncedAt) {
        return <span className="text-muted-foreground">—</span>;
      }
      return <div className="capitalize">{formatRelativeDate(syncedAt)}</div>;
    },
    meta: {
      className: calendarColumnWidths.synced_at,
    },
  },
];
