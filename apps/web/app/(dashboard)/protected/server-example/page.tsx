import { api } from "~/utils/api/server";

export default async function ServerProtectedExample() {
  const data = await api.catalog.catalogueItems.query();
  return (
    <div>
      <h1>Server Protected Example</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
