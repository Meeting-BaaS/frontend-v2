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

interface ScheduledBotsSearchFilterProps {
  botUuid?: string | null;
}

export function ScheduledBotsSearchFilter({
  botUuid,
}: ScheduledBotsSearchFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [localValue, setLocalValue] = useState(botUuid ?? "");

  const updateSearchParams = useRef(
    debounce((value: string) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("cursor");

      if (value.trim()) {
        newSearchParams.set("botUuid", value.trim());
      } else {
        newSearchParams.delete("botUuid");
      }

      router.replace(`${pathname}?${newSearchParams.toString()}`);
    }, 300),
  ).current;

  const handleChange = (value: string) => {
    setLocalValue(value);
    updateSearchParams(value);
  };

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

  useEffect(() => {
    return () => updateSearchParams.cancel();
  }, [updateSearchParams]);

  return (
    <InputGroup className="col-span-1 xl:col-span-2">
      <InputGroupInput
        ref={searchInputRef}
        placeholder="Search by bot ID..."
        name="botUuid"
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
