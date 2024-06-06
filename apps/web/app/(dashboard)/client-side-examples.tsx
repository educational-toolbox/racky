"use client";

import { api } from "~/utils/api/client";

export const ProtectedExample = () => {
  const { data, isLoading } = api.catalog.catalogueItems.useQuery();
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <h1>Client Protected Example</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export const PublicExample = () => {
  const { data, isLoading } = api.catalog.items.useQuery({ categoryId: "1" });
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <h1>Client Public Example</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
