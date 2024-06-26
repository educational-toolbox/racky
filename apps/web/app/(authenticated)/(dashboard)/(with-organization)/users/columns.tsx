import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/components/ui/data-table/column-header";
import type { RouterOutputs } from "~/utils/api/server";

export const columns: ColumnDef<RouterOutputs["org"]["getUsers"][0]>[] = [
  {
    accessorKey: "id",
    sortingFn: "alphanumeric",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "firstName",
    sortingFn: "alphanumeric",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First name" />
    ),
  },
  {
    accessorKey: "lastName",
    sortingFn: "alphanumeric",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last name" />
    ),
  },
  {
    accessorKey: "email",
    sortingFn: "alphanumeric",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "role",
    sortingFn: "alphanumeric",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Actions"
        className="text-right"
      />
    ),
    cell: ({ row }) => {
      const _user = row.original;
      return <div className="space-x-1 flex items-center justify-end">NYI</div>;
    },
  },
];
