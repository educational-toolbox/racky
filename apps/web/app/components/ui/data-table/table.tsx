"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { DataTablePagination } from "./pagination";
import { DataTableViewOptions } from "./view-options";
import { DataTableSearch } from "./table-search";
import type { ReactNode } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  withPagination,
  withSearch,
  extra,
}: DataTableProps<TData, TValue> & {
  withPagination?:
    | boolean
    | {
        pageSizes?: number[];
        selectableRows?: boolean;
      };
  withSearch?: boolean;
  extra?: ReactNode;
}) {
  const showPagination = withPagination !== false;
  const paginationOptions = {
    pageSizes: withPagination
      ? typeof withPagination === "boolean"
        ? [10, 20, 50]
        : withPagination.pageSizes ?? []
      : [],
    selectableRows: withPagination
      ? typeof withPagination === "boolean"
        ? false
        : withPagination.selectableRows ?? false
      : false,
  };
  const lessRowsThanSmallestPageSize =
    paginationOptions.pageSizes.length > 0 &&
    data.length < paginationOptions.pageSizes[0];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
    getFilteredRowModel: withSearch ? getFilteredRowModel() : undefined,
  });

  const someColumnsHideable = table
    .getAllColumns()
    .some((column) => column.getCanHide());

  return (
    <div className="flex flex-col gap-1">
      {(withSearch ?? someColumnsHideable ?? extra) && (
        <div className="flex items-center justify-between gap-1">
          {extra}
          {withSearch && <DataTableSearch table={table} />}
          {someColumnsHideable && (
            <div className="ml-auto">
              <DataTableViewOptions table={table} />
            </div>
          )}
        </div>
      )}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {showPagination && !lessRowsThanSmallestPageSize && (
        <DataTablePagination
          table={table}
          pageSizes={paginationOptions.pageSizes}
          selectableRows={paginationOptions.selectableRows}
        />
      )}
    </div>
  );
}
