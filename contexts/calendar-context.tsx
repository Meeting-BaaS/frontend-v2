"use client";

import { createContext, type ReactNode, useState } from "react";
import { useLocalStorage } from "react-use";
import type { CalendarView } from "@/types/calendars.types";

interface CalendarContextType {
  // Date management
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  // View management
  view: CalendarView;
  setView: (view: CalendarView) => void;
}

export const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined,
);

interface CalendarProviderProps {
  children: ReactNode;
  initialView?: CalendarView;
}

export function CalendarProvider({
  children,
  initialView = "month",
}: CalendarProviderProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useLocalStorage<CalendarView>(
    "calendar-view",
    initialView,
  );

  const value = {
    currentDate,
    setCurrentDate,
    view: view ?? initialView,
    setView,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}
