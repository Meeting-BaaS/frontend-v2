import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { columnWidths } from "@/components/transcripts/columns";

export function TranscriptsTableSkeleton() {
  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={columnWidths.bot_id}>Bot ID</TableHead>
            <TableHead className={columnWidths.provider}>Provider</TableHead>
            <TableHead className={columnWidths.bot_name}>Bot Name</TableHead>
            <TableHead className={columnWidths.duration}>
              <div className="text-center">Duration</div>
            </TableHead>
            <TableHead className={columnWidths.created_at}>Created At</TableHead>
            <TableHead className={columnWidths.actions}>
              <div className="text-center">View</div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell className={columnWidths.bot_id}>
                <div className="flex gap-3 items-center">
                  <Skeleton className="size-10 rounded-lg" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </TableCell>
              <TableCell className={columnWidths.provider}>
                <Skeleton className="h-6 w-24 rounded-full" />
              </TableCell>
              <TableCell className={columnWidths.bot_name}>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className={columnWidths.duration}>
                <div className="flex justify-center">
                  <Skeleton className="h-4 w-16" />
                </div>
              </TableCell>
              <TableCell className={columnWidths.created_at}>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell className={columnWidths.actions}>
                <div className="flex justify-center">
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
