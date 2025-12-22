"use client";

import { Check, ListFilter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProviderFilterProps {
  currentProviders: string[];
}

const providers = [
  { value: "gladia", label: "Gladia" },
  { value: "assemblyai", label: "AssemblyAI" },
  { value: "deepgram", label: "Deepgram" },
  { value: "azure-stt", label: "Azure STT" },
  { value: "openai-whisper", label: "OpenAI Whisper" },
  { value: "speechmatics", label: "Speechmatics" },
];

export function ProviderFilter({ currentProviders }: ProviderFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleProviderToggle = (provider: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Get current providers from URL
    const currentProvidersFromUrl = params.getAll("provider");

    if (currentProvidersFromUrl.includes(provider)) {
      // Remove provider
      params.delete("provider");
      currentProvidersFromUrl
        .filter((p) => p !== provider)
        .forEach((p) => params.append("provider", p));
    } else {
      // Add provider
      params.append("provider", provider);
    }

    // Reset pagination
    params.delete("cursor");

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearProviders = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("provider");
    params.delete("cursor");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 border-dashed",
            currentProviders.length > 0 &&
              "border-baas-primary-500 bg-baas-primary-500/10",
          )}
        >
          <ListFilter className="size-4" />
          Provider
          {currentProviders.length > 0 && (
            <div className="ml-1 rounded-sm bg-baas-primary-500 px-1 py-0.5 text-xs text-white">
              {currentProviders.length}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel>Filter by provider</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {providers.map((provider) => {
          const isSelected = currentProviders.includes(provider.value);
          return (
            <DropdownMenuCheckboxItem
              key={provider.value}
              checked={isSelected}
              onCheckedChange={() => handleProviderToggle(provider.value)}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "size-4 border rounded-sm flex items-center justify-center",
                    isSelected
                      ? "bg-baas-primary-500 border-baas-primary-500"
                      : "border-input",
                  )}
                >
                  {isSelected && <Check className="size-3 text-white" />}
                </div>
                <span>{provider.label}</span>
              </div>
            </DropdownMenuCheckboxItem>
          );
        })}
        {currentProviders.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={clearProviders}
            >
              Clear filters
            </Button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
