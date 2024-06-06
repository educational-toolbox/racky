import Link from "next/link";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";
import { forwardRef } from "react";
import { normalizeUrl, normalizeUrlPath } from "./lib/utils";

export const AppLink = forwardRef<
  ComponentRef<typeof Link>,
  ComponentPropsWithoutRef<typeof Link>
>(function ({ href, ...props }, ref) {
  let finalHref =    href;



  if (typeof finalHref === "string") {
    if (!finalHref.startsWith("http")) {
      finalHref = normalizeUrlPath(finalHref);
    } else {
      finalHref = normalizeUrl(finalHref);
    }
  }
  return <Link href={finalHref} {...props} ref={ref} />;
});

AppLink.displayName = "AppLink";
