import type { ColumnDef } from "@tanstack/react-table";
import { Icon } from "~/components/shared/app-icon";
import { AppImage } from "~/components/shared/app-image";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { DataTableColumnHeader } from "~/components/ui/data-table/column-header";
import type { Item } from "~/lib/api/server-types";
import { useInventoryFilters } from "./use-inventory-filters";
import { RequireAccessLevel } from "~/lib/auth";

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "picture",
    enableHiding: true,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => {
      const item = row.original;
      if (!item.picture) {
        return <Icon name="Image" className="w-12 h-12" />;
      }
      return (
        <AppImage
          useS3
          silentError
          fileKey={item.picture}
          className="w-12 h-12"
        />
      );
    },
  },
  {
    accessorKey: "name",
    sortingFn: "alphanumeric",
    enableHiding: false,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
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
      const [params, update] = useInventoryFilters();
      const selectedCatalogueId = params["catalogId"];
      const isCurrentSelected = selectedCatalogueId === item.catalogueItemId;
      return (
        <button
          disabled={isCurrentSelected}
          onClick={() => update({ catalogId: item.catalogueItemId })}
        >
          <Badge variant={isCurrentSelected ? "outline" : "default"}>
            {item.catalogueItem.name}
          </Badge>
        </button>
      );
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
          <RequireAccessLevel level="USER">
            <Button variant="outline" disabled>
              <Icon name="CalendarPlus" />
              Reserve
            </Button>
          </RequireAccessLevel>
          <RequireAccessLevel level="ADMIN">
            <Button variant="outline" size="icon" disabled>
              <Icon name="Pencil" />
            </Button>
            <Button variant="destructive" size="icon" disabled>
              <Icon name="Trash" />
            </Button>
          </RequireAccessLevel>
        </div>
      );
    },
  },
];
