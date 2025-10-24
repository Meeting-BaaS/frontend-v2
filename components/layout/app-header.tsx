"use client";

import { Bell, BotMessageSquare, MessageCirclePlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AI_CHAT_URL, DOCS_URL } from "@/lib/external-urls";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 flex items-center w-full justify-between px-4 py-2 border-b bg-background">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
      <div className="flex items-center">
        <Button variant="ghost" size="icon">
          <Bell />
        </Button>
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
            <DropdownMenuItem asChild>
              <Link href="/support-center?new=true">
                <MessageCirclePlus />
                Raise a ticket
              </Link>
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
