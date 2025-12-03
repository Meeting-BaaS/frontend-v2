import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

interface UseDataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  initialColumnFilters?: ColumnFiltersState;
  initialSorting?: SortingState;
  getRowId?: (row: TData) => string;
  manualPagination?: boolean;
  meta?: Record<string, unknown>;
}

export function useDataTable<TData, TValue>({
  data,
  columns,
  initialColumnFilters = [],
  initialSorting = [],
  getRowId,
  manualPagination = false,
  meta,
}: UseDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getRowId,
    meta,
    state: {
      sorting,
      columnFilters,
    },
  });

  return {
    table,
    columnFilters,
    setColumnFilters,
  };
}
