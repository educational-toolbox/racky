import { add } from "date-fns/add";
import type { ComponentProps, FormEventHandler } from "react";
import { useMemo, useRef, useState } from "react";
import type { DateRange, Matcher } from "react-day-picker";
import { z } from "zod";
import { AppImage } from "~/components/shared/app-image";
import { ReservationCalendar } from "~/components/shared/inventory/reservation-calendar";
import type { SheetButtonRef } from "~/components/shared/sheet-button";
import { SheetButton } from "~/components/shared/sheet-button";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { SheetFooter } from "~/components/ui/sheet";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/lib/api/client";
import type { Item } from "~/lib/api/server-types";
import { formatDateWithoutTime } from "~/lib/utils";

export const createReservationSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export type CreateReservationForm = z.infer<typeof createReservationSchema>;

const sheetConfig = {
  title: "Reserve Item",
};

export const ItemReservationButton = ({ item }: { item: Item }) => {
  const {
    data: allActiveReservations,
    isLoading: loadingActiveReservations,
    refetch: refetchActiveReservations,
    dataUpdatedAt: activeReservationsUpdatedAt,
  } = api.reservation.findActiveForItem.useQuery({ itemId: item.id });
  const createReservationMutation = api.reservation.create.useMutation();
  const { toast } = useToast();
  const sheetButtonRef = useRef<SheetButtonRef>(null);
  const [isSelectionValid, setIsSelectionValid] = useState(false);
  const firstDayOfReservationPossible = add(new Date(), { days: 1 });
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!startDate) return;
    const data = {
      startDate,
      endDate: endDate ?? startDate,
    };
    const handle = async () => {
      try {
        await createReservationMutation.mutateAsync({
          itemId: item.id,
          endDate: data.endDate,
          startDate: data.startDate,
        });
        setStartDate(undefined);
        setEndDate(undefined);
        await refetchActiveReservations();
        toast({
          title: "Reservation created",
          description: `Please wait for the admin to approve your reservation`,
          icon: "success",
        });
        sheetButtonRef.current?.close();
      } catch (e) {
        if (e instanceof Error) {
          toast({
            title: "Failed to create reservation",
            description: e.message,
            variant: "destructive",
            icon: "error",
          });
        }
      }
    };
    handle().catch(console.error);
  };

  const activeReservations = allActiveReservations ?? [];

  const disabledDates = activeReservations.map((reservation) => {
    const isSameDay = reservation.startDate === reservation.endDate;
    if (isSameDay) {
      return reservation.startDate;
    }
    const before =
      reservation.startDate > reservation.endDate
        ? reservation.startDate
        : reservation.endDate;
    const after =
      reservation.startDate > reservation.endDate
        ? reservation.endDate
        : reservation.startDate;
    return {
      after: add(after, { days: -1 }),
      before: add(before, { days: 1 }),
    };
  }) satisfies Matcher[];

  const onSelectDates = (range: DateRange | undefined) => {
    if (!range) {
      setStartDate(undefined);
      setEndDate(undefined);
      return;
    }
    if (range.from) {
      setStartDate(range.from);
    }
    if (range.to) {
      setEndDate(range.to);
    }
  };

  const calendarDisabledDates = [
    { before: firstDayOfReservationPossible },
    ...disabledDates,
  ];

  const buttonConfig = useMemo<ComponentProps<typeof SheetButton>["button"]>(
    () => ({
      icon: "CalendarPlus",
      text: "Reserve",
      variant: "outline",
      disabled: item.status !== "AVAILABLE",
    }),
    [item.status]
  );

  return (
    <SheetButton
      button={buttonConfig}
      ref={sheetButtonRef}
      sheet={sheetConfig}
      onClose={() => {
        setStartDate(undefined);
        setEndDate(undefined);
      }}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-6 mb-4">
        <div className="space-y-2">
          <span>{item.name}</span>
          <AppImage
            useS3
            silentError
            fileKey={item.picture ?? ""}
            className="aspect-square"
          />
        </div>
        <div className="space-y-2">
          <span>Choose your dates</span>
          <ReservationCalendar
            loading={loadingActiveReservations}
            startDate={startDate}
            endDate={endDate}
            onSelectDates={onSelectDates}
            disabled={calendarDisabledDates}
            onValidChange={setIsSelectionValid}
            key={activeReservationsUpdatedAt}
          />
        </div>
        {startDate !== undefined && (
          <div className="grid grid-cols-2 gap-1">
            <div className="space-y-2">
              <span>Start date</span>
              <Input
                value={formatDateWithoutTime(startDate)}
                type="date"
                disabled
              />
            </div>
            <div className="space-y-2">
              <span>End date</span>
              <Input
                value={formatDateWithoutTime(endDate ?? startDate!)}
                type="date"
                disabled
              />
            </div>
          </div>
        )}

        <SheetFooter>
          <Button
            type="submit"
            disabled={
              startDate === undefined ||
              createReservationMutation.isPending ||
              !isSelectionValid
            }
          >
            Reserve
          </Button>
        </SheetFooter>
      </form>
    </SheetButton>
  );
};
