"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { VariantProps } from "class-variance-authority";
import { Download } from "lucide-react";
import { Badge, type badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency-helpers";
import { formatUNIXDate } from "@/lib/date-helpers";
import type { Invoice } from "@/lib/schemas/settings";

// Column width configuration
export const columnWidths = {
  number: "min-w-[140px] max-w-[180px] w-[18%]",
  created: "min-w-[140px] max-w-[160px] w-[16%]",
  amountPaid: "min-w-[120px] max-w-[150px] w-[15%]",
  status: "min-w-[120px] max-w-[140px] w-[14%]",
  actions: "min-w-[100px] max-w-[120px] w-[12%]",
} as const;

// Status to badge variant mapping
const statusVariants: Record<
  string,
  VariantProps<typeof badgeVariants>["variant"]
> = {
  paid: "success",
  open: "warning",
  void: "destructive",
  uncollectible: "destructive",
};

export const columns: ColumnDef<Invoice>[] = [
  {
    id: "number",
    accessorKey: "number",
    header: "Invoice",
    meta: {
      className: columnWidths.number,
    },
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <span className="font-medium">
          {invoice.number ?? invoice.id.slice(0, 8)}
        </span>
      );
    },
  },
  {
    id: "created",
    accessorKey: "created",
    header: "Date",
    meta: {
      className: columnWidths.created,
    },
    cell: ({ row }) => formatUNIXDate(row.original.created),
  },
  {
    id: "amountPaid",
    accessorKey: "amountPaid",
    header: "Amount",
    meta: {
      className: columnWidths.amountPaid,
    },
    cell: ({ row }) =>
      formatCurrency(row.original.amountPaid, row.original.currency),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    meta: {
      className: columnWidths.status,
    },
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = statusVariants[status ?? ""] ?? "secondary";

      return (
        <Badge variant={variant} className="capitalize">
          {status ?? "unknown"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    meta: {
      className: columnWidths.actions,
    },
    cell: ({ row }) => {
      const invoice = row.original;
      if (!invoice.invoicePdf) return null;

      return (
        <div className="text-right">
          <Button
            variant="ghost"
            size="icon-sm"
            asChild
            className="inline-flex"
          >
            <a
              href={invoice.invoicePdf}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download invoice"
            >
              <Download className="size-4" />
            </a>
          </Button>
        </div>
      );
    },
  },
];
