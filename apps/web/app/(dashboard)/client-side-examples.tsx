"use client";

import { api } from "~/utils/api/client";

export const ProtectedExample = () => {
  const { data, isLoading } = api.catalog.catalogueItems.useQuery();
  if (isLoading) return <div>Loading...</div>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export const PublicExample = () => {
  const { data, isLoading } = api.catalog.items.useQuery({ categoryId: "1" });
  if (isLoading) return <div>Loading...</div>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};
