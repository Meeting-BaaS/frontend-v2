"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TicketIdFilterProps {
  ticketId?: string | null;
}

export function TicketIdFilter({ ticketId }: TicketIdFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("cursor");

    const value = inputRef.current?.value.trim();
    if (value) {
      newSearchParams.set("ticketId", value);
    } else {
      newSearchParams.delete("ticketId");
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`);
  }, [searchParams, router, pathname]);

  return (
    <div className="flex gap-2">
      <Input
        ref={inputRef}
        placeholder="Search by ticket ID..."
        defaultValue={ticketId ?? ""}
        className="w-56"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />
      <Button variant="outline" size="icon" onClick={handleSearch}>
        <Search className="size-4" />
      </Button>
    </div>
  );
}
