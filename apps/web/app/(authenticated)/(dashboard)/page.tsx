"use client";

import {
  OrganizationIdProvider,
  useOrganizationId,
} from "./organization-context";

export default function Home() {
  return (
    <OrganizationIdProvider>
      <Inner />
    </OrganizationIdProvider>
  );
}

const Inner = () => {
  const orgId = useOrganizationId();
  if (!orgId)
    return (
      <div className="text-center">
        You aren&apos;t a member of any organization. Please ask your
        administrator to invite you.
      </div>
    );
  return <div>{orgId}</div>;
};
