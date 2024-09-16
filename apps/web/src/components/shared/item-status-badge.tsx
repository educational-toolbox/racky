import { useMemo } from "react";
import { itemReservationStatuses, itemStatuses } from "./item-status-selector";
import type { ItemReservationStatus, ItemStatus } from "~/lib/api/server-types";
import { Badge } from "../ui/badge";
import { capitalize } from "~/lib/utils";

export const ItemStatusBadge = function <
  TSelectedSet = "item" | "reservation",
>({
  set = "item" as TSelectedSet,
  className,
  status,
}: {
  set?: TSelectedSet;
  className?: string;
  status: TSelectedSet extends "item" ? ItemStatus : ItemReservationStatus;
}) {
  const statuses = useMemo(() => {
    if (set == null) {
      return [...itemStatuses, ...itemReservationStatuses];
    }
    return set === "item" ? itemStatuses : itemReservationStatuses;
  }, [set]);
  const selectedStatus = statuses.find((s) => s.name === status);
  return (
    <Badge variant={selectedStatus?.color ?? "default"} className={className}>
      {capitalize(status)}
    </Badge>
  );
};
