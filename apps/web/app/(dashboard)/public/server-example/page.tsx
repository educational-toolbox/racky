import { api } from "~/utils/api/server";

export default async function ServerPublicExample() {
  const data = await api.catalog.items.query({ categoryId: "1" });
  return (
    <div>
      <h1>Server Protected Example</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
