import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/components/ui/data-table/column-header";
import { useRoleOverride } from "~/hooks/admin/use-role-override";
import type { RouterOutputs } from "~/lib/api/server-types";
import { hideEmail } from "~/lib/utils";

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
    cell: ({ row }) => {
      const user = row.original;
      const override = useRoleOverride();
      let emailView;
      if (
        (override.allowed && override.enabled) ||
        override.originalRole !== "ADMIN"
      ) {
        emailView = hideEmail(user.email);
      } else {
        emailView = user.email;
      }
      return <span>{emailView}</span>;
    },
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
        className="justify-end pr-0"
      />
    ),
    cell: ({ row }) => {
      const _user = row.original;
      return <div className="space-x-1 flex items-center justify-end">NYI</div>;
    },
  },
];
