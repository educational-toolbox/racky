import { useEffect, useState } from "react";
import type { DateAfter, DateBefore, DateRange } from "react-day-picker";
import { Loader } from "~/components/shared/loader";
import { Calendar } from "~/components/ui/calendar";
import { dateHasOverlaps } from "~/lib/utils";

export type ReservationCalendarProps = {
  loading: boolean;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onSelectDates: (range: DateRange | undefined) => void;
  disabled: boolean | ((DateBefore & Partial<DateAfter>) | Date)[];
  onValidChange: (valid: boolean) => void;
};

export const ReservationCalendar = ({
  loading,
  disabled,
  onSelectDates,
  onValidChange,
  startDate,
  endDate,
}: ReservationCalendarProps) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const disabledDates = typeof disabled === "boolean" ? [] : disabled;
  const hasOverlaps =
    startDate === undefined
      ? false
      : dateHasOverlaps(
          {
            from: startDate,
            to: endDate ?? startDate,
          },
          disabledDates.map((d) => {
            if (d instanceof Date) return d;
            if (d.after === undefined) return { before: d.before };
            return { from: d.before, to: d.after };
          }),
        );

  useEffect(() => {
    if (hasOverlaps) {
      setError("Selected dates have overlaps with existing reservations");
    } else {
      setError("");
    }
    onValidChange?.(!hasOverlaps);
  }, [hasOverlaps]);

  if (loading) {
    return (
      <div className="rounded-md border justify-center items-center flex h-48">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Calendar
        mode="range"
        max={5}
        weekStartsOn={1}
        className="rounded-md border justify-center items-center flex"
        selected={{ from: startDate, to: endDate }}
        onSelect={onSelectDates}
        disabled={disabled}
      />
      {!!error && (
        <p className="text-[0.8rem] font-medium text-destructive">{error}</p>
      )}
    </>
  );
};

ReservationCalendar.displayName = "ReservationCalendar";
