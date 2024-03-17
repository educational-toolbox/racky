"use client";

import { api } from "~/utils/api/client";

export const ClientDataExample = function () {
  const helloFromClient = api.hello.useQuery({ name: "Client side" });
  if (helloFromClient.isLoading) return <div>loading...</div>;
  return <p>{helloFromClient.data}</p>;
};
