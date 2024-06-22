"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { UserCard } from "~/components/shared/user/user-card";
import { Icon } from "~/components/ui/app-icon";
import { Button } from "~/components/ui/button";
import { DataTableColumnHeader } from "~/components/ui/data-table/column-header";
import type { RouterOutputs } from "~/utils/api/server";
import { DeleteOrganization } from "./delete-organization";
import { EditOrganization } from "./edit-organization";

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
      // const { data: user, isLoading } = {
      //   data: undefined as undefined | { id: string; name: string },
      //   isLoading: false,
      // }; // api.user.get.useQuery(organization.ownerId, { enabled: !!organization.ownerId });
      const isLoading = false;
      if (isLoading) return "Loading...";
      return (
        <UserCard
          user={{
            id: "user.id",
            email: "user.email",
            firstName: "user.firstName",
            lastName: "user.lastName",
          }}
          className="max-w-fit pr-4"
          link
        />
      );
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
