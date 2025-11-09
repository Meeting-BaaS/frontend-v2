"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/hooks/use-user";
import { formatRelativeDate } from "@/lib/date-helpers";
import type { TicketDetails } from "@/lib/schemas/support";

interface TicketViewMessagesProps {
  messageChain: TicketDetails["messageChain"];
}

export function TicketViewMessages({ messageChain }: TicketViewMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const currentUserEmail = user.email;

  // biome-ignore lint/correctness/useExhaustiveDependencies: we need to scroll to the bottom of the messages when the component mounts
  useEffect(() => {
    if (scrollRef.current) {
      const scrollableContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollableContainer) {
        scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
      }
    }
  }, [messageChain]);

  if (messageChain.length === 0) {
    return null;
  }

  return (
    <ScrollArea ref={scrollRef} className="mb-2 h-[30svh] w-full pr-4">
      <AnimatePresence>
        {messageChain.map((message) => {
          const isCurrentUser = message.authorEmail === currentUserEmail;

          return (
            <motion.div
              key={message.messageId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isCurrentUser ? (
                <div className="mb-4 flex items-center gap-2">
                  <div className="ml-auto w-2/3 rounded-md bg-baas-primary-500/50 dark:bg-baas-primary-700 p-2 dark:text-white">
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div className="mt-1 flex justify-end text-xs opacity-70">
                      {formatRelativeDate(message.timestamp)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 flex items-end gap-2">
                  <Avatar className="size-6">
                    <AvatarFallback className="bg-primary text-primary-foreground capitalize">
                      {message.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mr-auto w-2/3 rounded-md bg-secondary p-2 text-secondary-foreground">
                    <div className="mb-1 font-semibold text-primary text-xs">
                      {message.author}
                    </div>
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div className="mt-1 flex justify-end text-xs opacity-70">
                      {formatRelativeDate(message.timestamp)}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </ScrollArea>
  );
}
