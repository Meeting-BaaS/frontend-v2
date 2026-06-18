"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortFilterProps {
  sortBy?: string | null;
}

export function SortFilter({ sortBy }: SortFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const value = sortBy ?? "createdAt";

  const handleValueChange = (newValue: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("cursor");
    newSearchParams.set("sortBy", newValue);
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="createdAt">Latest created</SelectItem>
        <SelectItem value="updatedAt">Latest activity</SelectItem>
      </SelectContent>
    </Select>
  );
}
