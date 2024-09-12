import { useMemo } from "react";
import type { ItemReservationStatus, ItemStatus } from "~/lib/api/server-types";
import { capitalize } from "~/lib/utils";
import type { BadgeProps } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ItemStatusBadge } from "./item-status-badge";

export type StatusMeta<TName> = {
  name: TName;
  color: BadgeProps["variant"];
};

export const itemStatuses = [
  { color: "default", name: "AVAILABLE" },
  { color: "outline", name: "UNAVAILABLE" },
  { color: "secondary", name: "DRAFT" },
] satisfies StatusMeta<ItemStatus>[];
export const itemReservationStatuses = [
  { color: "outline", name: "RETURNED" },
  { color: "destructive", name: "CANCELLED" },
  { color: "secondary", name: "PENDING" },
  { color: "default", name: "CONFIRMED" },
] satisfies StatusMeta<ItemReservationStatus>[];

export const ItemStatusSelector = function <
  TSelectedSet = "item" | "reservation",
>({
  set = "item" as TSelectedSet,
  selectedItem,
  onSelect,
}: {
  set?: TSelectedSet;
  selectedItem?:
    | (TSelectedSet extends "item" ? ItemStatus : ItemReservationStatus)
    | null;
  onSelect: (
    selected: TSelectedSet extends "item" ? ItemStatus : ItemReservationStatus
  ) => void;
}) {
  const statuses = useMemo(
    () => (set === "item" ? itemStatuses : itemReservationStatuses),
    [set]
  );
  const selectedStatus = statuses.find(
    (status) => status.name === selectedItem
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={selectedStatus?.color ?? "outline"}>
          {capitalize(selectedItem ?? "Choose status")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={selectedItem ?? ""}
          onValueChange={(v) => {
            onSelect(v as Parameters<typeof onSelect>["0"]);
          }}
        >
          {statuses.map((status) => (
            <DropdownMenuRadioItem value={status.name} key={status.name}>
              <ItemStatusBadge status={status.name} />
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

ItemStatusSelector.displayName = "ItemStatusSelector";
