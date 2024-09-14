import { formatDate } from "date-fns/format";
import { Icon } from "~/components/shared/app-icon";
import { AppImage } from "~/components/shared/app-image";
import { ItemStatusBadge } from "~/components/shared/item-status-badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Reservation } from "~/lib/api/server-types";
import { CancelReservationButton } from "./cancel-reservation-button";
import { AppLink } from "~/components/app-link";

export const ReservationItem = ({
  reservation,
  cancellable,
  printable,
}: {
  reservation: Reservation;
  cancellable?: boolean;
  printable?: boolean;
}) => {
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
        <div className="flex gap-1">
          <AppImage
            useS3
            fileKey={reservation.item.picture!}
            silentError
            className="aspect-square w-12"
          />
          <div>
            <span>{reservation.item.name}</span>
            <br />
            <span className="inline-flex gap-1 items-center">
              <AppLink
                className="underline"
                href={`/inventory?categoryId=${reservation.item.catalogueItem.category.id}&catalogId=${reservation.item.catalogueItem.id}`}
              >
                {reservation.item.catalogueItem.name}
              </AppLink>
              <Icon name="Dot" size="12" />
              <AppLink
                className="underline"
                href={`/inventory?categoryId=${reservation.item.catalogueItem.category.id}`}
              >
                {reservation.item.catalogueItem.category.name}
              </AppLink>
            </span>
          </div>
        </div>

        {cancellable && <CancelReservationButton reservation={reservation} />}
        {printable && (
          <Button variant="secondary" className="w-full mt-2">
            <Icon name="Printer" />
            Print Invoice
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
