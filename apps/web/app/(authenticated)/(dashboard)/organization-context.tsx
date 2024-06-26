"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";
import { useSession } from "~/lib/auth";

const organizationIdContext = createContext<string | undefined>(undefined);

export const OrganizationIdProvider = ({
  children,
}: PropsWithChildren<{ strict?: boolean }>) => {
  const session = useSession();
  if (session.state !== "authenticated") return <>{children}</>;
  return (
    <organizationIdContext.Provider value={session.user.orgId ?? undefined}>
      {children}
    </organizationIdContext.Provider>
  );
};

export function useOrganizationId(params: { strict: true }): string;
export function useOrganizationId(params?: { strict: false }): string;
export function useOrganizationId(params: { strict?: boolean } = {}) {
  const orgID = useContext(organizationIdContext);
  if (params && params.strict === true && !orgID) {
    throw new Error("Organization ID not found");
  }
  return orgID;
}
