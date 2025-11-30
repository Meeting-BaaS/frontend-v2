import { columnWidths } from "@/components/admin/support/columns";
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

// Column headers matching the columns definition
const tableHeaders = [
  {
    label: "Ticket ID",
    width: columnWidths.ticketId,
  },
  {
    label: "Team Name",
    width: columnWidths.teamName,
  },
  {
    label: "Module",
    width: columnWidths.module,
  },
  {
    label: "Status",
    width: columnWidths.status,
  },
  {
    label: "Subject",
    width: columnWidths.subject,
  },
  {
    label: "Created At",
    width: columnWidths.createdAt,
  },
] as const;

export function AdminSupportTableSkeleton() {
  return (
    <div className="overflow-hidden">
      <UITable className="m-0 w-full table-fixed border-separate border-spacing-0 border-none p-0 text-left">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {tableHeaders.map((header, colIndex) => (
              <TableHead
                key={`th-${header.label}-${colIndex}`}
                className={cn(
                  header.width,
                  "h-8 px-3 !bg-secondary text-muted-foreground dark:!bg-input/30 border-b border-t border-input first:rounded-l-md first:border-l",
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
          {Array.from({ length: 50 }, (_, i) => `skeleton-row-${i}`).map(
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
