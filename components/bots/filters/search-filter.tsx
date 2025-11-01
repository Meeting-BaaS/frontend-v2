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
import { Kbd, KbdGroup } from "@/components/ui/kbd";

interface SearchFilterProps {
  botUuid?: string | null;
}

export function SearchFilter({ botUuid }: SearchFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Local state for immediate UI updates (optimistic UI)
  const [localValue, setLocalValue] = useState(botUuid ?? "");

  // Sync local state when prop changes (from server)
  useEffect(() => {
    setLocalValue(botUuid ?? "");
  }, [botUuid]);

  // Debounced function to update URL params
  const updateSearchParams = useRef(
    debounce((value: string) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      // Remove cursor when filtering to start from the beginning
      newSearchParams.delete("cursor");

      if (value.trim()) {
        newSearchParams.set("botUuid", value.trim());
      } else {
        newSearchParams.delete("botUuid");
      }

      router.replace(`${pathname}?${newSearchParams.toString()}`);
    }, 500),
  ).current;

  const handleChange = (value: string) => {
    // Update local state immediately for responsive UI
    setLocalValue(value);
    // Debounce the actual navigation
    updateSearchParams(value);
  };

  // Keyboard shortcut for search (Cmd/Ctrl + S)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "s") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      updateSearchParams.cancel();
    };
  }, [updateSearchParams]);

  return (
    <InputGroup className="flex-1">
      <InputGroupInput
        ref={searchInputRef}
        placeholder="Search by bot UUID..."
        value={localValue}
        onChange={(event) => handleChange(event.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>S</Kbd>
        </KbdGroup>
      </InputGroupAddon>
    </InputGroup>
  );
}
