"use client";

import { flexRender, type Table } from "@tanstack/react-table";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as UITable,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./empty";

// Extend ColumnMeta type to include className
declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: We need to extend the ColumnMeta type to include className
  interface ColumnMeta<TData, TValue> {
    className?: string;
  }
}

interface DataTableProps<TData> {
  table: Table<TData>;
  clientSideSearch?: boolean;
  searchColumn?: string;
  searchPlaceholder?: string;
  clientSideFilters?: React.ReactNode;
  serverSidePagination?: boolean;
  serverSideFilters?: boolean;
  prevIteratorLink?: string | null;
  nextIteratorLink?: string | null;
  rowCellClassName?: string;
  tableContainerClassName?: string;
}

export function DataTable<TData>({
  table,
  clientSideSearch = false,
  searchColumn = "email",
  searchPlaceholder = "Search...",
  clientSideFilters,
  serverSidePagination = false,
  serverSideFilters = false,
  prevIteratorLink,
  nextIteratorLink,
  rowCellClassName,
  tableContainerClassName,
}: DataTableProps<TData>) {
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  if (table.getRowModel().rows?.length === 0) {
    return (
      <Empty className="border rounded-lg">
        <EmptyHeader>
          <EmptyTitle>No results found</EmptyTitle>
          <EmptyDescription>
            Try adjusting your filters, date range or search query
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div>
      {serverSidePagination && (
        // Hidden links are rendered at the top of the page so that NextJS can prefetch the next and previous pages
        <div className="hidden">
          <Link href={prevIteratorLink ?? ""}>Previous</Link>

          <Link href={nextIteratorLink ?? ""}>Next</Link>
        </div>
      )}
      {!serverSideFilters && (
        <div className="flex mt-4 sm:mt-0 gap-2 w-full flex-col md:flex-row items-center py-4">
          {clientSideSearch && searchColumn && (
            <InputGroup className="flex-1">
              <InputGroupInput
                name={searchColumn ?? "search"}
                ref={searchInputRef}
                placeholder={searchPlaceholder}
                value={
                  (table.getColumn(searchColumn)?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn(searchColumn)
                    ?.setFilterValue(event.target.value)
                }
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
          )}
          {clientSideFilters}
        </div>
      )}
      <div className={cn("overflow-hidden", tableContainerClassName)}>
        <UITable className="m-0 w-full table-fixed border-separate border-spacing-0 border-none p-0 text-left">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "h-8 px-3 !bg-secondary dark:!bg-input/30 border-b border-t border-input first:rounded-l-md first:border-l last:rounded-r-md last:border-r last:text-right text-muted-foreground",
                        header.column.columnDef.meta?.className,
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-transparent"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "py-3 h-10 overflow-hidden text-ellipsis whitespace-nowrap border-b px-3 text-sm last:text-right",
                        cell.column.columnDef.meta?.className,
                        rowCellClassName,
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </UITable>
      </div>
      <div className="flex items-center md:justify-end space-x-2 py-4">
        {serverSidePagination ? (
          <>
            <Button
              variant="outline"
              size="sm"
              className="w-1/2 md:w-auto"
              asChild={Boolean(prevIteratorLink)}
              disabled={!prevIteratorLink}
            >
              {prevIteratorLink ? (
                <Link href={prevIteratorLink}>Previous</Link>
              ) : (
                "Previous"
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-1/2 md:w-auto"
              asChild={Boolean(nextIteratorLink)}
              disabled={!nextIteratorLink}
            >
              {nextIteratorLink ? (
                <Link href={nextIteratorLink}>Next</Link>
              ) : (
                "Next"
              )}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              className="w-1/2 md:w-auto"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-1/2 md:w-auto"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
