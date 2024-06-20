"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { AppLink } from "~/app-link";
import { Button } from "~/components/ui/button";
import { DataTableColumnHeader } from "~/components/ui/data-table/column-header";
import Icon from "~/components/ui/icon";
import type { RouterOutputs } from "~/utils/api/server";

export const columns: ColumnDef<RouterOutputs["org"]["list"][0]>[] = [
  {
    accessorKey: "name",
    sortingFn: "alphanumeric",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Organization name" />
    ),
  },
  {
    accessorKey: "zone",
    sortingFn: "alphanumeric",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Zone" />
    ),
  },
  {
    accessorKey: "ownerId",
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner" />
    ),
    cell: ({ row }) => {
      const _organization = row.original;
      const { data: user, isLoading } = {
        data: undefined as undefined | { id: string; name: string },
        isLoading: false,
      }; // api.user.get.useQuery(organization.ownerId, { enabled: !!organization.ownerId });
      if (isLoading) return "Loading...";
      if (!user) return "N/A";
      return <AppLink href={`/admin/users/${user.id}`}>{user.name}</AppLink>;
    },
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
      const _organization = row.original;
      return (
        <div className="space-x-1 flex items-center justify-end">
          <Button
            variant="outline"
            tooltip="Assign owner to an organization"
            size="icon"
            disabled
          >
            <Icon name="UserCheck" />
          </Button>
          <Button
            variant="outline"
            tooltip="Edit organization"
            size="icon"
            disabled
          >
            <Icon name="Pencil" />
          </Button>
          <Button
            variant="destructive"
            tooltip="Delete organization"
            size="icon"
            disabled
          >
            <Icon name="Trash2" />
          </Button>
        </div>
      );
    },
  },
];
