"use client";

import { columnWidths } from "@/components/admin/users/columns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as UITable,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const tableHeaders = [
  { label: "Email", width: columnWidths.email, style: { width: "30%" } },
  { label: "Role", width: columnWidths.role, style: { width: "12%" } },
  { label: "Status", width: columnWidths.status, style: { width: "12%" } },
  { label: "", width: columnWidths.actions, style: { width: "6%" } },
] as const;

export function AdminUsersTableSkeleton() {
  return (
    <div className="overflow-hidden mt-4">
      <UITable className="m-0 w-full table-fixed border-separate border-spacing-0 border-none p-0 text-left">
        <colgroup>
          {tableHeaders.map((header) => (
            <col key={header.label || "actions"} style={header.style} />
          ))}
        </colgroup>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {tableHeaders.map((header, colIndex) => (
              <TableHead
                key={`th-${header.label}-${colIndex}`}
                className={cn(
                  header.width,
                  "h-8 px-3 bg-secondary! text-muted-foreground dark:bg-input/30! border-b border-t border-input first:rounded-l-md first:border-l",
                  colIndex === tableHeaders.length - 1
                    ? "last:rounded-r-md last:border-r last:text-right"
                    : "",
                )}
              >
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }, (_, i) => `skeleton-row-${i}`).map(
            (rowKey) => (
              <TableRow key={rowKey} className="hover:bg-transparent">
                {tableHeaders.map((header, colIndex) => (
                  <TableCell
                    key={`td-${header.label}-${colIndex}`}
                    className={cn(
                      "py-4 h-8 overflow-hidden text-ellipsis whitespace-nowrap border-b px-3 text-sm",
                      header.width,
                    )}
                  >
                    <Skeleton className="h-2 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ),
          )}
        </TableBody>
      </UITable>
    </div>
  );
}
