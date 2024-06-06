import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
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
