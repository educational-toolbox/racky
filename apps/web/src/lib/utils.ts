import { clsx } from "clsx";
import type { ClassValue } from "clsx";
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

export function normalizeUrlPath(url: string) {
  if (url === "/") return "/";
  let final = url;
  if (final.endsWith("/")) {
    final = final.slice(0, -1);
  }
  if (!final.startsWith("/")) {
    final = `/${final}`;
  }
  return final;
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
