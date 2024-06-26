"use client";

import { Card, CardHeader } from "~/components/ui/card";
import { DataTable } from "~/components/ui/data-table/table";
import { api } from "~/utils/api/client";
import { useOrganizationId } from "../../organization-context";
import { columns } from "./columns";
import { InviteUser } from "./invite-user";

const OrganizationUsersPage = () => {
  const orgId = useOrganizationId({ strict: true });
  const { data: users, isLoading } = api.org.getUsers.useQuery({ id: orgId });

  if (isLoading) return <div className="w-full text-center">Loading...</div>;
  return (
    <Card>
      <CardHeader>
        <DataTable
          columns={columns}
          data={users ?? []}
          withPagination={{
            pageSizes: [10, 50, 100],
          }}
          withSearch
          extra={<InviteUser orgId={orgId} />}
        />
      </CardHeader>
    </Card>
  );
};

export default OrganizationUsersPage;
