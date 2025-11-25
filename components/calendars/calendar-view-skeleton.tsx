import { Skeleton } from "@/components/ui/skeleton";

export function CalendarViewSkeleton() {
  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="p-4">
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}
