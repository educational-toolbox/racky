"use client";

import { useOrganizationId } from "./organization-context";

export default function Home() {
  const orgId = useOrganizationId();
  if (!orgId)
    return (
      <div className="text-center">
        You are&apos;nt a member of any organization. Please contact your
        administrator.
      </div>
    );
  return <div>{orgId}</div>;
}
