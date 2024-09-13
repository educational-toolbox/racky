import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { add } from "date-fns/add";
import { areIntervalsOverlapping } from "date-fns/areIntervalsOverlapping";
import { differenceInDays } from "date-fns/differenceInDays";
import { format } from "date-fns/format";
import { isWithinInterval } from "date-fns/isWithinInterval";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function noop() {}

export function toUpperCase(str: string) {
  return str.toUpperCase();
}

export function toLowerCase(str: string) {
  return str.toLowerCase();
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function trim(str: string) {
  return str.trim();
}

export function slugToTitle(slug: string) {
  const parts = slug.split("-").map(trim);
  if (parts.length < 1) return "";
  return [capitalize(parts[0]), ...parts.slice(1).map(toLowerCase)].join(" ");
}

export function normalizeUrlPath(url: string): `/${string}` {
  if (url === "/") return "/";
  let final = url;
  if (final.endsWith("/")) {
    final = final.slice(0, -1);
  }
  if (!final.startsWith("/")) {
    final = `/${final}`;
  }
  return final as `/${string}`;
}

export function normalizeUrl(url: URL | string) {
  return new URL(url.toString()).toString();
}

export function hideEmail(email: string) {
  const [user, domain] = email.split("@");
  const hiddenUser =
    user.length > 5
      ? `${user.slice(0, 2)}...${user.slice(-2)}`
      : user.slice(0, 1) + "...";
  const hiddenDomain = domain
    .split(".")
    .map((part) => {
      if (part.length > 3) {
        return `${part.slice(0, 1)}...${part.slice(-1)}`;
      }
      return part;
    })
    .join(".");
  return `${hiddenUser}@${hiddenDomain}`;
}

export function formatDateWithoutTime(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export type DateRange = {
  from: Date;
  to: Date;
};

export function dateHasOverlaps(
  check: DateRange | Date,
  against: (DateRange | { before: Date } | Date)[]
) {
  return against.some((range) => {
    if (range instanceof Date) {
      if (check instanceof Date) {
        return differenceInDays(range, check) === 0;
      }
      return isWithinInterval(range, {
        end: check.to,
        start: check.from,
      });
    }
    if ("before" in range) {
      const before = add(range.before, { days: 1 });
      if (check instanceof Date) {
        return differenceInDays(before, check) === 0;
      }
      return isWithinInterval(before, {
        end: check.to,
        start: check.from,
      });
    }
    if (check instanceof Date) {
      return isWithinInterval(check, {
        end: range.to,
        start: range.from,
      });
    }
    return areIntervalsOverlapping(
      { start: check.from, end: check.to },
      { start: range.from, end: range.to }
    );
  });
}

export function findNextAvailableDate(check: Date, against: DateRange[]) {
  const next = new Date(check);
  while (dateHasOverlaps({ from: next, to: next }, against)) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}
