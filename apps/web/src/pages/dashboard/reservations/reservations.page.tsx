import { formatDate } from "date-fns/format";
import { isAfter } from "date-fns/isAfter";
import { isBefore } from "date-fns/isBefore";
import { isToday } from "date-fns/isToday";
import { isWithinInterval } from "date-fns/isWithinInterval";
import { useMemo } from "react";
import { Icon } from "~/components/shared/app-icon";
import { AppImage } from "~/components/shared/app-image";
import { ItemStatusBadge } from "~/components/shared/item-status-badge";
import { Loader } from "~/components/shared/loader";
import { Title } from "~/components/title";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/lib/api/client";
import type { Reservation } from "~/lib/api/server-types";
import { RequireAccessLevel } from "~/lib/auth";

export const ReservationsPage = () => {
  const { data, isLoading } = api.reservation.getMy.useQuery();
  const reservations = useMemo(() => {
    const today = new Date();
    const result = {
      active: [] as Reservation[],
      past: [] as Reservation[],
      future: [] as Reservation[],
      missing: [] as Reservation[],
    };
    if (!data) return result;
    for (const reservation of data) {
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
      result.missing.push(reservation);
    }
    return result;
  }, [data]);

  return (
    <>
      <Title>Reservations</Title>
      <RequireAccessLevel level="USER" exclusive>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReservationsColumn
            title="Past reservations"
            reservations={reservations.past}
            loading={isLoading}
          />
          <ReservationsColumn
            title="Active reservations"
            reservations={reservations.active}
            loading={isLoading}
          />
          <ReservationsColumn
            title="Future reservations"
            reservations={reservations.future}
            loading={isLoading}
            cancellable
          />
        </div>
      </RequireAccessLevel>
      <RequireAccessLevel level="ADMIN" exclusive>
        admin coming soon
      </RequireAccessLevel>
    </>
  );
};

const ReservationsColumn = ({
  loading,
  reservations,
  title,
  cancellable,
}: {
  title: string;
  loading: boolean;
  reservations: Reservation[];
  cancellable?: boolean;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          <Badge variant="outline">{reservations.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <Loader centered />}
        {!loading && (
          <ReservationsList
            reservations={reservations}
            cancellable={cancellable}
          />
        )}
      </CardContent>
    </Card>
  );
};

const ReservationsList = ({
  reservations,
  cancellable = false,
}: {
  reservations: Reservation[];
  cancellable?: boolean;
}) => {
  return (
    <div className="space-y-2">
      {reservations.map((reservation) => (
        <ReservationItem
          key={reservation.id}
          reservation={reservation}
          cancellable={cancellable}
        />
      ))}
    </div>
  );
};

const ReservationItem = ({
  reservation,
  cancellable,
}: {
  reservation: Reservation;
  cancellable?: boolean;
}) => {
  const { data: item, isLoading } = api.items.getOne.useQuery({
    id: reservation.itemId,
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {formatDate(reservation.endDate, "dd/MM/yyyy")} -{" "}
          {formatDate(reservation.endDate, "dd/MM/yyyy")}
        </CardTitle>
        <ItemStatusBadge<"reservation">
          set="reservation"
          status={reservation.status}
          className="max-w-min"
        />
      </CardHeader>
      <CardContent>
        {isLoading && <Loader centered />}
        {!isLoading && item != null && (
          <div className="flex gap-1">
            <AppImage
              useS3
              fileKey={item.picture!}
              silentError
              className="aspect-square w-12"
            />
            <div>
              <span>{item.name}</span>
              <br />
              <span>{item.catalogueItem.name}</span>
            </div>
          </div>
        )}
        {cancellable && (
          <Button variant="destructive" className="w-full mt-2">
            <Icon name="CalendarX" />
            Cancel
          </Button>
        )}
        {!cancellable && (
          <Button variant="secondary" className="w-full mt-2">
            <Icon name="Printer" />
            Print Invoice
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
