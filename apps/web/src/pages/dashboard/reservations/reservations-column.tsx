import { format } from "date-fns/format";
import { Icon } from "~/components/shared/app-icon";
import { Loader } from "~/components/shared/loader";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { Reservation } from "~/lib/api/server-types";
import { ReservationItem } from "./reservation-item";
import { AppImage } from "~/components/shared/app-image";
import { AppLink } from "~/components/app-link";

export const ReservationsColumn = ({
  loading,
  reservations,
  title,
  approvable,
  cancellable,
  printable,
  collapsible,
  className,
  /**
   * If provided, the reservations will be displayed in a table format, ignoring the `printable`, `cancellable` and `approvable` props.
   */
  caption,
}: {
  title: string;
  loading: boolean;
  reservations: Reservation[];
  approvable?: boolean;
  cancellable?: boolean;
  printable?: boolean;
  className?: string;
  collapsible?: boolean;
  caption?: string;
}) => {
  if (collapsible) {
    return (
      <Collapsible className={className}>
        <Card>
          <CardHeader>
            <CollapsibleTrigger>
              <CardTitle className="flex items-center gap-2">
                {title}
                <Badge variant="outline">{reservations.length}</Badge>
                <Icon name="ChevronsUpDown" className="ml-auto" />
              </CardTitle>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              {loading && <Loader centered />}
              {!loading && !caption && (
                <ReservationsList
                  reservations={reservations}
                  approvable={approvable}
                  cancellable={cancellable}
                  printable={printable}
                />
              )}
              {!loading && !!caption && (
                <ReservationTable
                  reservations={reservations}
                  caption={caption}
                />
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  }

  return (
    <Card className={className}>
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
            approvable={approvable}
            cancellable={cancellable}
            printable={printable}
          />
        )}
      </CardContent>
    </Card>
  );
};

const ReservationsList = ({
  reservations,
  cancellable = false,
  printable = false,
  approvable = false,
}: {
  reservations: Reservation[];
  cancellable?: boolean;
  printable?: boolean;
  approvable?: boolean;
}) => {
  return (
    <div className="space-y-2">
      {reservations.map((reservation) => (
        <ReservationItem
          key={reservation.id}
          approvable={approvable}
          reservation={reservation}
          cancellable={cancellable}
          printable={printable}
        />
      ))}
    </div>
  );
};

const ReservationTable = ({
  reservations,
  caption,
}: {
  reservations: Reservation[];
  caption: string;
}) => {
  return (
    <Table>
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="max-w-48">ID</TableHead>
          <TableHead>Picture</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Catalogue</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reservations.map((reservation) => (
          <TableRow key={reservation.id}>
            <TableCell className="max-w-48">{reservation.id}</TableCell>
            <TableCell>
              <AppImage
                useS3
                fileKey={reservation.item.picture!}
                className="w-16 aspect-square"
              />
            </TableCell>
            <TableCell>
              <AppLink
                className="underline"
                href={`/inventory?categoryId=${reservation.item.catalogueItem.category.id}`}
              >
                {reservation.item.catalogueItem.category.name}
              </AppLink>
            </TableCell>
            <TableCell>
              <AppLink
                className="underline"
                href={`/inventory?categoryId=${reservation.item.catalogueItem.category.id}&catalogId=${reservation.item.catalogueItem.id}`}
              >
                {reservation.item.catalogueItem.name}
              </AppLink>
            </TableCell>
            <TableCell>{reservation.item.name}</TableCell>
            <TableCell>{format(reservation.startDate, "dd/MM/yyyy")}</TableCell>
            <TableCell>{format(reservation.endDate, "dd/MM/yyyy")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
