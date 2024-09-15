import { useMemo } from "react";
import { api } from "~/lib/api/client";
import type { Reservation } from "~/lib/api/server-types";
import { ReservationsColumn } from "./reservations-column";

export const AdminReservations = () => {
  const { data, isLoading } = api.reservation.getAllForMyOrg.useQuery();

  const reservations = useMemo(() => {
    const result = {
      approved: [] as Reservation[],
      pending: [] as Reservation[],
      cancelled: [] as Reservation[],
      count: 0,
      total: 0,
    };

    if (!data) return result;

    for (const reservation of data) {
      if (reservation.status === "CANCELLED") {
        result.cancelled.push(reservation);
        continue;
      }
      if (reservation.status === "CONFIRMED") {
        result.approved.push(reservation);
        continue;
      }
      if (reservation.status === "PENDING") {
        result.pending.push(reservation);
        continue;
      }
      result.pending.push(reservation);
    }

    result.count =
      result.approved.length + result.pending.length + result.cancelled.length;
    result.total = data.length;

    return result;
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <ReservationsColumn
        title="Pending reservations"
        className="col-span-1 md:col-span-2"
        reservations={reservations.pending}
        loading={isLoading}
        cancellable
        approvable
      />
      <ReservationsColumn
        title="Approved reservations"
        className="col-span-1 md:col-span-3"
        reservations={reservations.approved}
        loading={isLoading}
        printable
        collapsible
      />
      {reservations.cancelled.length > 0 && (
        <ReservationsColumn
          title="Cancelled reservations"
          reservations={reservations.cancelled}
          loading={isLoading}
          className="col-span-1 md:col-span-5"
          collapsible
          caption="Cancelled reservations"
        />
      )}
    </div>
  );
};
