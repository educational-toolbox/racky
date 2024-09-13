import { Card, CardHeader } from "~/components/ui/card";
import { DataTable } from "~/components/ui/data-table/table";
import { api } from "~/lib/api/client";
import { useOrganizationId } from "../organization-context";
import { columns } from "./columns";
import { InviteUser } from "./invite-user";
import { RequireAccessLevel } from "~/lib/auth";
import { Title } from "~/components/title";

const OrganizationUsersPage = () => {
  const orgId = useOrganizationId({ strict: true });
  const { data: users, isLoading } = api.org.getUsers.useQuery({ id: orgId });

  if (isLoading) return <div className="w-full text-center">Loading...</div>;
  return (
    <>
      <Title>Users management</Title>
      <Card>
        <CardHeader>
          <DataTable
            columns={columns}
            data={users ?? []}
            withPagination={{
              pageSizes: [10, 50, 100],
            }}
            withSearch
            extra={
              <RequireAccessLevel level="ADMIN" allowOverride>
                <InviteUser orgId={orgId} />
              </RequireAccessLevel>
            }
          />
        </CardHeader>
      </Card>
    </>
  );
};

export default OrganizationUsersPage;
