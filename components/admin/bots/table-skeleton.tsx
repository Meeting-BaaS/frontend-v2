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

// Column widths - must be written explicitly for Tailwind JIT to detect them
// These match the widths defined in columns.tsx
const tableHeaders = [
  {
    label: "Bot ID",
    width: "w-[350px]",
  },
  {
    label: "Status",
    width: "min-w-[150px] max-w-[200px] w-[20%]",
  },
  {
    label: "Team Name",
    width: "min-w-[160px] max-w-[180px] w-[18%]",
  },
  {
    label: "Duration",
    width: "min-w-[100px] max-w-[120px] w-[12%]",
  },
  {
    label: "Created At",
    width: "min-w-[140px] max-w-[150px] w-[15%]",
  },
] as const;

export function AdminBotsTableSkeleton() {
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
