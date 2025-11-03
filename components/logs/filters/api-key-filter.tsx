"use client";

import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ApiKey } from "@/lib/schemas/api-keys";

interface ApiKeyFilterProps {
  apiKeyId?: number | null;
  apiKeys: ApiKey[];
}

export function ApiKeyFilter({ apiKeyId, apiKeys }: ApiKeyFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Local state for immediate UI updates (optimistic UI)
  const [localApiKeyId, setLocalApiKeyId] = useState<string | undefined>(
    apiKeyId?.toString() ?? undefined,
  );

  // Helper function to update URL params
  const updateURL = (newApiKeyId: string | undefined) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Remove cursor when filtering to start from the beginning
    newSearchParams.delete("cursor");

    if (newApiKeyId) {
      newSearchParams.set("apiKeyId", newApiKeyId);
    } else {
      newSearchParams.delete("apiKeyId");
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  const handleApiKeyChange = (value: string) => {
    const newValue = value === "all" ? undefined : value;
    setLocalApiKeyId(newValue);
    updateURL(newValue);
  };

  // Find the selected API key name for display
  const selectedApiKey = apiKeys.find((key) => key.id === localApiKeyId);
  const displayText = selectedApiKey ? selectedApiKey.name : "All API Keys";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="col-span-1 justify-between">
          <span className="truncate">{displayText}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-[300px] overflow-y-auto">
        <DropdownMenuRadioGroup
          value={localApiKeyId ?? "all"}
          onValueChange={handleApiKeyChange}
        >
          <DropdownMenuRadioItem value="all">
            All API Keys
          </DropdownMenuRadioItem>
          <DropdownMenuSeparator />
          {apiKeys.map((apiKey) => (
            <DropdownMenuRadioItem key={apiKey.id} value={apiKey.id}>
              {apiKey.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
