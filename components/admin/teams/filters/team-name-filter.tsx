"use client";

import { debounce } from "lodash-es";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface TeamNameFilterProps {
  searchTeamName?: string | null;
}

export function TeamNameFilter({ searchTeamName }: TeamNameFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Local state for immediate UI updates (optimistic UI)
  const [localValue, setLocalValue] = useState(searchTeamName ?? "");

  // Debounced function to update URL params
  const updateSearchParams = useRef(
    debounce((value: string) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      // Remove cursor when filtering to start from the beginning
      newSearchParams.delete("cursor");

      if (value.trim()) {
        newSearchParams.set("searchTeamName", value.trim());
      } else {
        newSearchParams.delete("searchTeamName");
      }

      router.replace(`${pathname}?${newSearchParams.toString()}`);
    }, 300),
  ).current;

  const handleChange = (value: string) => {
    // Update local state immediately for responsive UI
    setLocalValue(value);
    // Debounce the actual navigation
    updateSearchParams(value);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      updateSearchParams.cancel();
    };
  }, [updateSearchParams]);

  return (
    <InputGroup className="col-span-1">
      <InputGroupInput
        ref={searchInputRef}
        placeholder="Search by team name..."
        name="searchTeamName"
        value={localValue}
        onChange={(event) => handleChange(event.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}
