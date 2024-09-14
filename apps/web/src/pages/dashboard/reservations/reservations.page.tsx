import { isAfter } from "date-fns/isAfter";
import { isBefore } from "date-fns/isBefore";
import { isToday } from "date-fns/isToday";
import { isWithinInterval } from "date-fns/isWithinInterval";
import { useMemo } from "react";
import { Title } from "~/components/title";
import { api } from "~/lib/api/client";
import type { Reservation } from "~/lib/api/server-types";
import { RequireAccessLevel } from "~/lib/auth";
import { ReservationsColumn } from "./reservations-column";

export const ReservationsPage = () => {
  const { data, isLoading } = api.reservation.getMy.useQuery();
  const reservations = useMemo(() => {
    const today = new Date();
    const result = {
      active: [] as Reservation[],
      past: [] as Reservation[],
      future: [] as Reservation[],
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
      if (isToday(reservation.startDate) || isToday(reservation.endDate)) {
        result.active.push(reservation);
        continue;
      }
      if (
        isWithinInterval(today, {
          start: reservation.startDate,
          end: reservation.endDate,
        })
      ) {
        result.active.push(reservation);
        continue;
      }
      if (isBefore(reservation.endDate, today)) {
        result.past.push(reservation);
        continue;
      }
      if (isAfter(reservation.startDate, today)) {
        result.future.push(reservation);
        continue;
      }
    }
    result.count =
      result.active.length +
      result.past.length +
      result.future.length +
      result.cancelled.length;
    result.total = data.length;
    return result;
  }, [data]);

  return (
    <>
      <Title>
        {`[${reservations.active.length}/${reservations.total}] Reservations`}
      </Title>
      <RequireAccessLevel level="USER" exclusive>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReservationsColumn
            title="Past reservations"
            reservations={reservations.past}
            loading={isLoading}
            printable
          />
          <ReservationsColumn
            title="Active reservations"
            reservations={reservations.active}
            loading={isLoading}
            printable
          />
          <ReservationsColumn
            title="Future reservations"
            reservations={reservations.future}
            loading={isLoading}
            cancellable
          />
          {reservations.cancelled.length > 0 && (
            <ReservationsColumn
              title="Cancelled reservations"
              reservations={reservations.cancelled}
              loading={isLoading}
              className="col-span-1 md:col-span-3"
              collapsible
              caption="Cancelled reservations"
            />
          )}
        </div>
      </RequireAccessLevel>
      <RequireAccessLevel level="ADMIN" exclusive>
        admin coming soon
      </RequireAccessLevel>
    </>
  );
};
