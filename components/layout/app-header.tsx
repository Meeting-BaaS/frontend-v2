"use client";

import { BotMessageSquare, MessageCirclePlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSupportDialog } from "@/hooks/use-support-dialog";
import { AI_CHAT_URL, DOCS_URL } from "@/lib/external-urls";
import type { Module } from "@/lib/schemas/support";

export function AppHeader() {
  const pathname = usePathname();
  const { openSupportDialog } = useSupportDialog();

  const handleRaiseTicket = () => {
    let module: Module | undefined;
    let botUuid: string | undefined;

    // Parse pathname segments
    const pathSegments = pathname.split("/").filter(Boolean);

    // Determine module and bot UUID based on pathname
    if (pathSegments[0] === "bots") {
      module = "bots";
      // If there's a second segment, it's the bot UUID
      if (pathSegments[1]) {
        botUuid = pathSegments[1];
      }
    } else if (pathSegments[0] === "calendars") {
      module = "calendars";
    } else if (
      pathSegments[0] === "settings" &&
      pathSegments[1] === "billing"
    ) {
      module = "billing";
    }

    openSupportDialog({
      ...(module && { module }),
      ...(botUuid && { botUuid }),
    });
  };

  return (
    <header className="sticky top-0 z-20 flex items-center w-full justify-between px-4 py-2 border-b bg-background">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
      <div className="flex items-center">
        {/* Will be implemented in the future */}
        {/* <Button variant="ghost" size="icon">
          <Bell />
        </Button> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link">Help</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-full min-w-36"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuItem asChild>
              <Link
                href={AI_CHAT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BotMessageSquare />
                Chat with AI
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRaiseTicket}>
              <MessageCirclePlus />
              Raise a ticket
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="link" asChild>
          <Link href={DOCS_URL} target="_blank" rel="noopener noreferrer">
            Docs
          </Link>
        </Button>
      </div>
    </header>
  );
}
