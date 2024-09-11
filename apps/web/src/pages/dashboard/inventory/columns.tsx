import type { ColumnDef } from "@tanstack/react-table";
import { Icon } from "~/components/shared/app-icon";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { DataTableColumnHeader } from "~/components/ui/data-table/column-header";
import type { Item } from "~/lib/api/server-types";

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "name",
    sortingFn: "alphanumeric",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "picture",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
  },
  {
    accessorKey: "itemCatalog.name",
    enableHiding: false,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Catalog" />
    ),
    cell: ({ row }) => {
      const item = row.original;
      return <Badge>{item.itemCatalog.name}</Badge>;
    },
  },
  {
    accessorKey: "status",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
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
      const _item = row.original;
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
        </div>
      );
    },
  },
];
