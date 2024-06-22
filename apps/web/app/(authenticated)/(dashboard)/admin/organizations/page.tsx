"use client";

import { Card, CardHeader } from "~/components/ui/card";
import { api } from "~/utils/api/client";
import { columns } from "./columns";
import { DataTable } from "~/components/ui/data-table/table";

export default function AdminOrganizationsPage() {
  const { data, isLoading } = api.org.list.useQuery();
  if (isLoading) return <div>Loading...</div>;
  return (
    <Card>
      <CardHeader>
        <DataTable
          columns={columns}
          data={data ?? []}
          withPagination={{
            pageSizes: [10, 50, 100],
          }}
          withSearch
        />
      </CardHeader>
    </Card>
  );
}
