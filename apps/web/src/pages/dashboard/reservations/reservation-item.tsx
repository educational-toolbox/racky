import { formatDate } from "date-fns/format";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { AppLink } from "~/components/app-link";
import { Icon } from "~/components/shared/app-icon";
import { AppImage } from "~/components/shared/app-image";
import { ItemStatusBadge } from "~/components/shared/item-status-badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { Reservation } from "~/lib/api/server-types";
import { ApproveReservationButton } from "./approve-reservation-button";
import { CancelReservationButton } from "./cancel-reservation-button";
import { UserCard } from "~/components/shared/user/user-card";

export const ReservationItem = ({
  reservation,
  cancellable,
  approvable,
  printable,
  withUserInfo,
}: {
  reservation: Reservation;
  cancellable?: boolean;
  printable?: boolean;
  approvable?: boolean;
  withUserInfo?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => ref.current,
  });
  return (
    <Card
      ref={ref}
      className="print:mt-12 print:mx-40 print:flex print:flex-col-reverse"
    >
      <CardHeader className="print:p-4">
        <CardTitle>
          {formatDate(reservation.startDate, "dd/MM/yyyy")} -{" "}
          {formatDate(reservation.endDate, "dd/MM/yyyy")}
        </CardTitle>
        <ItemStatusBadge<"reservation">
          set="reservation"
          status={reservation.status}
          className="max-w-min"
        />
      </CardHeader>
      <CardContent className="print:p-4">
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
                className="underline print:no-underline"
                href={`/inventory?categoryId=${reservation.item.catalogueItem.category.id}&catalogId=${reservation.item.catalogueItem.id}`}
              >
                {reservation.item.catalogueItem.name}
              </AppLink>
              <Icon name="Dot" size="12" />
              <AppLink
                className="underline print:no-underline"
                href={`/inventory?categoryId=${reservation.item.catalogueItem.category.id}`}
              >
                {reservation.item.catalogueItem.category.name}
              </AppLink>
            </span>
          </div>
        </div>
        <div className="flex gap-1 items-center">
          {approvable && <ApproveReservationButton reservation={reservation} />}
          {cancellable && <CancelReservationButton reservation={reservation} />}
          {printable && (
            <Button
              variant="secondary"
              className="w-full mt-2 print:hidden"
              onClick={handlePrint}
            >
              <Icon name="Printer" />
              Print Invoice
            </Button>
          )}
        </div>
      </CardContent>
      {withUserInfo && (
        <CardFooter className="border-t border-dashed pb-1">
          <UserCard
            link
            className="w-full border-none shadow-none"
            userId={reservation.user.id}
          />
        </CardFooter>
      )}
    </Card>
  );
};
