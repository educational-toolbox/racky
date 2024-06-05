import { api } from "~/utils/api/server";

export default async function Home() {
  const data = await api.catalog.catalogueItems.query();
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
