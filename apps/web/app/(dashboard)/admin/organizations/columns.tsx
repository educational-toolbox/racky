"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { UserCard } from "~/components/shared/user/user-card";
import { Icon } from "~/components/ui/app-icon";
import { Button } from "~/components/ui/button";
import { DataTableColumnHeader } from "~/components/ui/data-table/column-header";
import type { RouterOutputs } from "~/utils/api/server";
import { DeleteOrganization } from "./delete-organization";
import { EditOrganization } from "./edit-organization";
import { api } from "~/utils/api/client";

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
      const organization = row.original;
      const { data: owner, isLoading } = api.user.getUser.useQuery(
        { id: organization.ownerId! },
        { enabled: !!organization.ownerId },
      );
      console.log(owner);
      if (isLoading) return "Loading...";
      if (!owner) return "N/A";
      return <UserCard user={owner} className="max-w-fit pr-4" link />;
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
      const organization = row.original;
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
          <EditOrganization org={organization} />
          <DeleteOrganization org={organization} />
        </div>
      );
    },
  },
];
