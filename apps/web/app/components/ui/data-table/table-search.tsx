"use client";

import type { Table } from "@tanstack/react-table";

import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { Input } from "../input";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableSearch<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const [search, setSearch] = useState("");
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      table.setGlobalFilter(e.target.value);
    },
    [table],
  );
  return (
    <Input
      value={search}
      onChange={onChange}
      placeholder="Search..."
      icon="Search"
    />
  );
}
