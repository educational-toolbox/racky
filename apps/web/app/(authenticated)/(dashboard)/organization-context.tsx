"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";
import { useSession } from "~/lib/auth";

const organizationIdContext = createContext<string | undefined>(undefined);

export const OrganizationIdProvider = ({
  children,
  strict: enforce = false,
}: PropsWithChildren<{ strict?: boolean }>) => {
  const session = useSession();
  if (session.state !== "authenticated") return null;
  if (enforce && !session.user.orgId) return null;
  return (
    <organizationIdContext.Provider value={session.user.orgId ?? undefined}>
      {children}
    </organizationIdContext.Provider>
  );
};

export function useOrganizationId(params: { strict: true }): string;
export function useOrganizationId(params?: {
  strict: false;
}): string | undefined;
export function useOrganizationId({ strict }: { strict?: boolean } = {}) {
  const orgID = useContext(organizationIdContext);
  if (strict && !orgID) throw new Error("Organization ID not found");
  return orgID;
}
