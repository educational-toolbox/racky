import { api } from "~/utils/api/server";

export default async function InventoryPage() {
  const data = await api.catalog.items.query({ categoryId: "1" });
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
